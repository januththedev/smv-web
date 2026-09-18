import { defineEventHandler, getRequestURL } from "h3";
import { authorizationServerMetadata, protectedResourceMetadata } from "../utils/oauth";

/**
 * OAuth discovery documents (RFC 8414 + RFC 9728). Served from middleware —
 * not the file router — because `.well-known` dot-paths are unreliable in
 * file-based routing. Claude reads these to learn the authorize / token /
 * register URLs instead of guessing /authorize. Passes anything else through.
 */
export default defineEventHandler((event) => {
  const url = getRequestURL(event);
  if (url.pathname === "/.well-known/oauth-authorization-server") {
    return authorizationServerMetadata(url.origin);
  }
  if (url.pathname === "/.well-known/oauth-protected-resource") {
    return protectedResourceMetadata(url.origin);
  }
  return undefined;
});
