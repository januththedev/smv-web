import { defineEventHandler } from "h3";
import { readSiteContent } from "../../src/lib/site-content.server";

export default defineEventHandler(() => readSiteContent());
