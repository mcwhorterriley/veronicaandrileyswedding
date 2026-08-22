const RSVP_RESPONSES_KEY = "wedding-rsvp-responses-v2";

const readRaw = () => {
  try {
    return JSON.parse(localStorage.getItem(RSVP_RESPONSES_KEY) || "{}");
  } catch {
    return {};
  }
};

export const readRsvpResponses = () => readRaw();

export const getMemberResponse = (memberId) => readRaw()[memberId] || null;

export const writeMemberResponse = ({ member, group, status, submittedBy }) => {
  if (!member?.id || !group?.id || !["accepted", "declined"].includes(status)) {
    throw new Error("Invalid RSVP response payload");
  }

  const current = readRaw();
  current[member.id] = {
    memberId: member.id,
    guestName: `${member.firstName} ${member.lastName}`,
    invitationId: group.id,
    invitationLabel: group.label,
    invitationSize: group.members.length,
    status,
    submittedById: submittedBy?.id || member.id,
    submittedByName: submittedBy ? `${submittedBy.firstName} ${submittedBy.lastName}` : `${member.firstName} ${member.lastName}`,
    updatedAt: new Date().toISOString(),
  };

  localStorage.setItem(RSVP_RESPONSES_KEY, JSON.stringify(current));
  window.dispatchEvent(new CustomEvent("wedding-rsvp-responses-updated"));
  return current[member.id];
};

export const clearRsvpResponses = () => {
  localStorage.removeItem(RSVP_RESPONSES_KEY);
  window.dispatchEvent(new CustomEvent("wedding-rsvp-responses-updated"));
};
