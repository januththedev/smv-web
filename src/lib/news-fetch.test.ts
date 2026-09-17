import assert from "node:assert/strict";
import { test, mock } from "node:test";
import dns from "node:dns/promises";
import http from "node:http";
import https from "node:https";
import { EventEmitter } from "node:events";
import { Readable } from "node:stream";
import { fetchNewsText, isPublicNewsAddress } from "./news-fetch.server.ts";

 test("rejects non-public and transition addresses; accepts ordinary public addresses", () => {
  for (const ip of ["0.0.0.0", "10.1.2.3", "127.1.2.3", "169.254.169.254", "172.16.0.1", "192.168.1.1", "100.64.0.1", "192.0.0.9", "192.0.2.1", "198.18.0.1", "198.51.100.1", "203.0.113.1", "224.0.0.1", "255.255.255.255", "::", "::1", "::ffff:8.8.8.8", "64:ff9b::808:808", "fc00::1", "fe80::1", "ff02::1", "2001:db8::1", "2001::1", "2002:808:808::1", "3fff::1", "invalid"]) {
    assert.equal(isPublicNewsAddress(ip), false, ip);
  }
  for (const ip of ["8.8.8.8", "1.1.1.1", "2606:4700:4700::1111", "2001:4860:4860::8888"]) {
    assert.equal(isPublicNewsAddress(ip), true, ip);
  }
});

test("validates before requesting, pins DNS, and refuses all redirects offline", async () => {
  let addresses = [{ address: "8.8.8.8", family: 4 }];
  let resolutions = 0;
  let requests = 0;
  let status = 200;
  let lastOptions: https.RequestOptions | undefined;
  const resolve = mock.method(dns, "lookup", async () => { resolutions++; return addresses; });
  const request = (_url: URL, options: https.RequestOptions, callback: (response: Readable) => void) => {
    requests++;
    lastOptions = options;
    const req = new EventEmitter() as EventEmitter & { end: () => void; destroy: () => void };
    req.destroy = () => {};
    req.end = () => {
      const response = Object.assign(Readable.from([Buffer.from("news")]), { statusCode: status, headers: { location: "http://127.0.0.1/" } });
      callback(response);
    };
    return req;
  };
  const h = mock.method(http, "request", request);
  const s = mock.method(https, "request", request);
  try {
    for (const url of ["file:///etc/passwd", "ftp://example.com/", "http://localhost/", "http://LOCALHOST./", "http://sub.localhost/", "http://127.1/", "http://2130706433/", "http://0x7f000001/", "http://[::1]/", "https://user:pass@example.com/"]) {
      assert.equal(await fetchNewsText(url), null, url);
    }
    assert.equal(requests, 0);
    assert.equal(resolutions, 0);
    addresses = [{ address: "8.8.8.8", family: 4 }, { address: "10.0.0.1", family: 4 }];
    assert.equal(await fetchNewsText("https://rsshub.app/"), null);
    assert.equal(requests, 0);
    addresses = [];
    assert.equal(await fetchNewsText("https://rsshub.app/"), null);
    addresses = [{ address: "8.8.8.8", family: 4 }];
    assert.equal(await fetchNewsText("https://rsshub.app/feed"), "news");
    assert.equal(lastOptions?.agent, false);
    const before = resolutions;
    addresses = [{ address: "127.0.0.1", family: 4 }];
    // The socket's lookup must use the validated snapshot, not resolve again.
    const lookup = lastOptions?.lookup as Function;
    lookup("rsshub.app", {}, (error: unknown, address: string, family: number) => {
      assert.equal(error, null); assert.equal(address, "8.8.8.8"); assert.equal(family, 4);
    });
    assert.equal(resolutions, before);
    addresses = [{ address: "8.8.8.8", family: 4 }];
    for (status of [301, 302, 303, 307, 308, 404, 500]) {
      const beforeRequests: number = requests;
      assert.equal(await fetchNewsText("https://rsshub.app/"), null);
      assert.equal(requests, beforeRequests + 1);
    }
    status = 200;
    assert.equal(await fetchNewsText("http://8.8.8.8/feed"), null);
    assert.equal(await fetchNewsText("http://www.facebook.com/feed"), "news");
    assert.equal(await fetchNewsText("https://rsshub.app.attacker.example/"), null);
  } finally { resolve.mock.restore(); h.mock.restore(); s.mock.restore(); }
});
