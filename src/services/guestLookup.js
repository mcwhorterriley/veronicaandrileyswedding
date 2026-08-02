import { TEMP_GUESTS } from "../data/guests.js";

export const normalizeName = (value = "") =>
  value.trim().toLowerCase().replace(/[^a-z0-9]/g, "");

export const findGuestByName = (firstName, lastName) => {
  const first = normalizeName(firstName);
  const last = normalizeName(lastName);

  if (!first || !last) return null;

  return (
    TEMP_GUESTS.find(
      (guest) =>
        normalizeName(guest.firstName) === first &&
        normalizeName(guest.lastName) === last,
    ) ?? null
  );
};
