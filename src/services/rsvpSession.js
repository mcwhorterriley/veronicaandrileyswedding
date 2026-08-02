const RSVP_STORAGE_KEY = "wedding-rsvp-session";

export const readRsvpSession = () => {
  try {
    return JSON.parse(localStorage.getItem(RSVP_STORAGE_KEY) || "null");
  } catch {
    return null;
  }
};

export const writeRsvpSession = (session) => {
  localStorage.setItem(RSVP_STORAGE_KEY, JSON.stringify(session));
};

export const clearRsvpSession = () => {
  localStorage.removeItem(RSVP_STORAGE_KEY);
};
