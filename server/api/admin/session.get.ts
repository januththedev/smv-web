import { defineEventHandler } from "h3";
import { isAdminRequest } from "../../utils/admin-auth";

export default defineEventHandler(async (event) => ({ authenticated: await isAdminRequest(event.req as Request) }));
