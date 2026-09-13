# SMV GYM Wadduwa

Official site for **SMV GYM** — Galle Road, Wadduwa, Sri Lanka.

The Best Gym in the City. Strength, bodybuilding, personal coaching with Saranga Lakmal, and beach training on the south coast.

## Visit

- **Address:** 567/2/1, Galle Road, Wadduwa, Sri Lanka
- **Phone:** +94 71 273 8110 · +94 77 144 6003
- **Email:** sarangalak@gmail.com
- **Facebook:** [SarangalakmalFitness](https://www.facebook.com/SarangalakmalFitness)
- **Instagram:** [@smv_gym_wadduwa](https://www.instagram.com/smv_gym_wadduwa/)

## Develop

```bash
npm install
npm run dev
```

## Admin and MCP

The protected editor is available at `/admin`. Set `ADMIN_PASSWORD` in Vercel;
the password is never sent to the browser or stored in the repository.

Connect an MCP client to `/api/mcp` using HTTP Basic authentication. Enter the
same admin password when the client asks for credentials. No MCP API token is
needed.

For production, add `ADMIN_PASSWORD`, `ADMIN_SESSION_SECRET`, `DATABASE_URL`
(Neon), and `BLOB_READ_WRITE_TOKEN` (Vercel Blob) to the Vercel project.
