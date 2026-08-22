# Wedding Website RSVP Build — Invitation Groups

This prototype now uses named invitation groups instead of a single guest + anonymous count.

## Current behavior

- Any named person on an invitation can search their own first and last name.
- They can RSVP only for themselves, or choose **RSVP for my party**.
- Party RSVP can only select people explicitly assigned to the same invitation.
- Anyone not selected remains **Pending** and can RSVP independently later.
- A later response can update that named person's current RSVP status.
- Accepted guests unlock the Details tab.
- Registry remains public.
- `/admin` shows total invited, attending, declined, pending, each guest name, invitation size, who submitted the response, and the system log.

## Admin identities

Riley McWhorter and Veronica McWhorter are marked as admin members in `src/data/guests.js`.

**Important:** the current `/admin` page still uses browser-local prototype data and is not production-secure authentication. Real cross-device RSVP tracking and a truly locked Riley/Veronica-only admin page require a backend/database and authentication.

## Test invitation

The temporary test data includes a six-person `Test Family` invitation:

- Sissy Guest
- Test Person2
- Test Person3
- Test Person4
- Test Person5
- Test Person6

Replace the temporary records in `src/data/guests.js` with the verified wedding guest list before production.

## Run

```bash
npm install
npm run dev
```

Then test:

- `/rsvp`
- `/admin`

## Admin authorization

Riley McWhorter and Veronica McWhorter are marked as admin-eligible guests. After either completes an RSVP, an Admin Access prompt appears. The admin enters only their email; a successful match permanently authorizes that browser via localStorage. There is no logout UI or expiration. Five incorrect attempts lock admin verification on that browser.

Before testing, edit `src/services/adminAuth.js` and replace:
- `REPLACE_WITH_RILEY_EMAIL`
- `REPLACE_WITH_VERONICA_EMAIL`

with the exact two email addresses.

Direct visits to `/admin` are blocked until that browser has been authorized.
