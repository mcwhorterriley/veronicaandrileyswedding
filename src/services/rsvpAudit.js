const AUDIT_KEY = "wedding-rsvp-audit-log";
const MAX_EVENTS = 500;

const readRaw = () => {
  try {
    return JSON.parse(localStorage.getItem(AUDIT_KEY) || "[]");
  } catch {
    return [];
  }
};

export const readAuditLog = () => readRaw();

export const writeAuditEvent = ({ level = "INFO", eventType, guestName = "", enteredName = "", metadata = {} }) => {
  const event = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
    createdAt: new Date().toISOString(),
    level,
    eventType,
    guestName,
    enteredName,
    metadata,
  };

  const next = [event, ...readRaw()].slice(0, MAX_EVENTS);
  localStorage.setItem(AUDIT_KEY, JSON.stringify(next));
  window.dispatchEvent(new CustomEvent("wedding-rsvp-audit-updated"));
  return event;
};

export const clearAuditLog = () => {
  localStorage.removeItem(AUDIT_KEY);
  window.dispatchEvent(new CustomEvent("wedding-rsvp-audit-updated"));
};
