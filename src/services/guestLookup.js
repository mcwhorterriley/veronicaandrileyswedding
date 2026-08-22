import { ALL_INVITED_MEMBERS, INVITATION_GROUPS } from "../data/guests.js";

export const normalizeName = (value = "") =>
  value.trim().toLowerCase().replace(/[^a-z0-9]/g, "");

export const findInvitationMemberByName = (firstName, lastName = "") => {
  const first = normalizeName(firstName);
  const last = normalizeName(lastName);

  if (!first) return null;

  let member = null;

  if (last) {
    member = ALL_INVITED_MEMBERS.find(
      (guest) =>
        normalizeName(guest.firstName) === first &&
        normalizeName(guest.lastName) === last,
    );
  } else {
    const firstNameMatches = ALL_INVITED_MEMBERS.filter(
      (guest) => normalizeName(guest.firstName) === first,
    );

    // First-name-only lookup is allowed only when it resolves to one person.
    if (firstNameMatches.length === 1) {
      member = firstNameMatches[0];
    }
  }

  if (!member) return null;

  const group = INVITATION_GROUPS.find((item) => item.id === member.invitationId);
  return group ? { member, group } : null;
};

export const findGuestByName = (firstName, lastName = "") =>
  findInvitationMemberByName(firstName, lastName)?.member ?? null;
