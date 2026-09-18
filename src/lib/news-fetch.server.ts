import dns from "node:dns/promises";
import http from "node:http";
import https from "node:https";
import { BlockList, isIP } from "node:net";

// Conservative IANA special-use policy: no private, shared, local, documentation,
// benchmark, multicast or reserved IPv4; only ordinary IPv6 global unicast.
const denied = new BlockList();
for (const [address, prefix] of [
  ["0.0.0.0", 8], ["10.0.0.0", 8], ["100.64.0.0", 10],
  ["127.0.0.0", 8], ["169.254.0.0", 16], ["172.16.0.0", 12],
  ["192.0.0.0", 24], ["192.0.2.0", 24], ["192.88.99.0", 24],
  ["192.168.0.0", 16], ["198.18.0.0", 15], ["198.51.100.0", 24],
  ["203.0.113.0", 24], ["224.0.0.0", 4], ["240.0.0.0", 4],
] as const) denied.addSubnet(address, prefix, "ipv4");
const globalV6 = new BlockList();
globalV6.addSubnet("2000::", 3, "ipv6");
for (const [address, prefix] of [
  ["2001::", 23], // special-purpose (including Teredo/benchmark/ORCHID)
  ["2001:db8::", 32], ["2002::", 16], // documentation / 6to4
  ["3fff::", 20], // documentation
] as const) denied.addSubnet(address, prefix, "ipv6");

export function isPublicNewsAddress(address: string): boolean {
  const family = isIP(address);
  if (family === 4) return !denied.check(address, "ipv4");
  // Also excludes mapped IPv4, NAT64, scoped/link-local and future allocations.
  return family === 6 && !address.includes("%") &&
    globalV6.check(address, "ipv6") && !denied.check(address, "ipv6");
}

export async function fetchNewsText(input: string, timeoutMs = 4500): Promise<string | null> {
  let url: URL;
  let hostname: string;
  try {
    url = new URL(input);
    if (!['http:', 'https:'].includes(url.protocol) || url.username || url.password) return null;
    hostname = url.hostname.replace(/^\[|\]$/g, "").replace(/\.$/, "").toLowerCase();
    if (!hostname || hostname === "localhost" || hostname.endsWith(".localhost") ||
      hostname.endsWith(".local") || (!isIP(hostname) && !hostname.includes("."))) return null;
    if (isIP(hostname) && !isPublicNewsAddress(hostname)) return null;
    // News has only these fixed providers; DNS checks still apply to both.
    if (!new Set(["rsshub.app", "www.facebook.com"]).has(hostname)) return null;
  } catch { return null; }

  // Deadline covers DNS, connect/TLS, headers and the entire response body.
  return new Promise((resolve) => {
    let finished = false;
    let request: http.ClientRequest | undefined;
    const finish = (value: string | null) => {
      if (finished) return;
      finished = true;
      clearTimeout(timer);
      request?.destroy();
      resolve(value);
    };
    const timer = setTimeout(() => finish(null), timeoutMs);
    void (async () => {
      try {
        const addresses = isIP(hostname)
          ? [{ address: hostname, family: isIP(hostname) }]
          : await dns.lookup(hostname, { all: true, verbatim: true });
        if (finished) return;
        if (!addresses.length || addresses.some(({ address, family }) =>
          isIP(address) !== family || !isPublicNewsAddress(address))) return finish(null);
        const pinned = addresses[0]!;
        const transport = url.protocol === "https:" ? https : http;
        request = transport.request(url, {
          // No pooled socket, proxy agent, or second DNS resolution. Keep the URL
          // hostname for Host, TLS SNI and certificate verification.
          agent: false,
          family: pinned.family,
          lookup: (_host, options, callback) => {
            if (options.all) callback(null, [pinned]);
            else callback(null, pinned.address, pinned.family);
          },
          headers: {
            accept: "application/rss+xml, application/atom+xml, application/xml, text/xml, text/html, */*",
            "user-agent": "Mozilla/5.0 (compatible; SMVGym/1.0; +https://www.facebook.com/SarangalakmalFitness)",
          },
        }, (response) => {
          // Node HTTP never follows redirects; reject every non-success status.
          if (!response.statusCode || response.statusCode < 200 || response.statusCode >= 300) {
            response.destroy();
            return finish(null);
          }
          const chunks: Buffer[] = [];
          let bytes = 0;
          response.on("data", (chunk: Buffer) => {
            bytes += chunk.length;
            if (bytes > 2 * 1024 * 1024) { response.destroy(); finish(null); }
            else chunks.push(chunk);
          });
          response.on("end", () => finish(Buffer.concat(chunks).toString("utf8")));
          response.on("error", () => finish(null));
          response.on("aborted", () => finish(null));
        });
        request.on("error", () => finish(null));
        request.end();
      } catch { finish(null); }
    })();
  });
}
