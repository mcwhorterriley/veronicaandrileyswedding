# Wedding Website RSVP Build

This build preserves the original wedding website and adds a modular RSVP flow.

## Current routes

- `/` — original Pooh landing page
- `/rsvp` — direct RSVP destination for the invitation QR code

## Test guests

- Riley McWhorter
- Veronica McWhorter
- Test Guest

## Important

The guest list and RSVP storage are currently local prototype data. Before mailing invitations, replace `src/data/guests.js` and the browser-storage service with a server-side database/API such as Supabase.

## Run locally

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## Current UI additions

- Accepted guests receive a personalized RSVP confirmation.
- The confirmation includes a **View Wedding Details** button that opens the protected Details tab.
- Registry is now its own public navigation tab and links to the Amazon wedding registry.
- No meal selections or song requests are collected.
