import { useEffect, useMemo, useState } from "react";
import { AlertTriangle, CheckCircle2, Clock3, RefreshCw, ShieldAlert, Trash2, Users } from "lucide-react";
import { ALL_INVITED_MEMBERS, INVITATION_GROUPS } from "../data/guests.js";
import { clearAuditLog, readAuditLog } from "../services/rsvpAudit.js";
import { readRsvpResponses } from "../services/rsvpResponses.js";
import { isAdminAuthorized, isAdminMember, remainingAdminAttempts, verifyAdminEmail } from "../services/adminAuth.js";
import { readRsvpSession } from "../services/rsvpSession.js";

const fmt = (iso) => {
  if (!iso) return "—";
  return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" }).format(new Date(iso));
};

const levelClasses = {
  INFO: "bg-sky-100 text-sky-800 border-sky-200",
  WARN: "bg-amber-100 text-amber-900 border-amber-200",
  ERROR: "bg-red-100 text-red-800 border-red-200",
};

export default function AdminPage() {
  const [authorized, setAuthorized] = useState(() => isAdminAuthorized());
  const session = readRsvpSession();

  if (!authorized) {
    return <AdminAccessGate session={session} onAuthorized={() => setAuthorized(true)} />;
  }

  return <AuthorizedAdminPage />;
}

function AdminAccessGate({ session, onAuthorized }) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const eligible = Boolean(session?.guestId && isAdminMember(session.guestId));

  const verify = (event) => {
    event.preventDefault();
    setError("");
    if (!eligible) return;
    const result = verifyAdminEmail(session.guestId, email);
    if (result.ok) {
      onAuthorized();
      return;
    }
    if (result.configurationError) {
      setError("Admin email has not been configured yet.");
      return;
    }
    if (result.locked) {
      setError("Too many incorrect attempts. Admin access is locked on this browser.");
      return;
    }
    setError(`That email doesn't match our admin record. ${result.remaining} ${result.remaining === 1 ? "try" : "tries"} remaining.`);
  };

  return (
    <section className="mx-auto max-w-xl px-4 py-16 text-center">
      <div className="rounded-3xl border border-amber-200 bg-white/95 p-8 shadow-xl">
        <ShieldAlert className="mx-auto text-amber-700" size={42} />
        <h1 className="mt-4 font-serif text-3xl text-amber-950">Wedding Administration</h1>
        {eligible ? (
          <>
            <p className="mt-3 text-stone-600">Your RSVP is already saved. Enter your admin email once to authorize this browser.</p>
            <form onSubmit={verify} className="mt-6">
              <input type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email address" className="w-full rounded-xl border border-amber-300 px-4 py-3 outline-none focus:ring-2 focus:ring-amber-500" required />
              {error && <p className="mt-3 text-sm font-semibold text-red-700">{error}</p>}
              <button type="submit" disabled={remainingAdminAttempts(session.guestId) === 0} className="mt-5 w-full rounded-xl bg-amber-700 px-5 py-3 font-semibold text-white hover:bg-amber-800 disabled:cursor-not-allowed disabled:opacity-50">Access Admin Portal</button>
            </form>
          </>
        ) : (
          <>
            <p className="mt-3 text-stone-600">This area is reserved for Riley and Veronica. Complete your RSVP first to authorize this browser.</p>
            <a href="/rsvp" className="mt-6 inline-flex rounded-xl bg-amber-700 px-5 py-3 font-semibold text-white hover:bg-amber-800">Go to RSVP</a>
          </>
        )}
      </div>
    </section>
  );
}

function AuthorizedAdminPage() {
  const [events, setEvents] = useState(() => readAuditLog());
  const [responses, setResponses] = useState(() => readRsvpResponses());
  const [filter, setFilter] = useState("ALL");
  const [guestSearch, setGuestSearch] = useState("");

  const refresh = () => {
    setEvents(readAuditLog());
    setResponses(readRsvpResponses());
  };

  useEffect(() => {
    const handler = () => refresh();
    window.addEventListener("wedding-rsvp-audit-updated", handler);
    window.addEventListener("wedding-rsvp-responses-updated", handler);
    window.addEventListener("storage", handler);
    return () => {
      window.removeEventListener("wedding-rsvp-audit-updated", handler);
      window.removeEventListener("wedding-rsvp-responses-updated", handler);
      window.removeEventListener("storage", handler);
    };
  }, []);

  const stats = useMemo(() => {
    const values = Object.values(responses);
    const attending = values.filter((r) => r.status === "accepted").length;
    const declined = values.filter((r) => r.status === "declined").length;
    const pending = Math.max(0, ALL_INVITED_MEMBERS.length - attending - declined);
    const failedLookups = events.filter((e) => e.eventType === "LOOKUP_NOT_FOUND").length;
    const blockedLimits = events.filter((e) => e.eventType === "PARTY_LIMIT_BLOCKED").length;
    const errors = events.filter((e) => e.level === "ERROR").length;
    return { invited: ALL_INVITED_MEMBERS.length, attending, declined, pending, failedLookups, blockedLimits, errors };
  }, [events, responses]);

  const guestRows = useMemo(() => {
    const q = guestSearch.trim().toLowerCase();
    return ALL_INVITED_MEMBERS.map((member) => {
      const response = responses[member.id];
      return { ...member, response };
    }).filter((row) => !q || `${row.firstName} ${row.lastName} ${row.invitationLabel}`.toLowerCase().includes(q));
  }, [responses, guestSearch]);

  const filteredEvents = events.filter((e) => filter === "ALL" || e.level === filter);

  return (
    <section className="mx-auto max-w-7xl px-4 py-8 md:px-6">
      <div className="mb-6 rounded-2xl border border-amber-300 bg-amber-50/95 p-4 text-sm text-amber-950 shadow-sm">
        <div className="flex gap-3"><ShieldAlert className="mt-0.5 shrink-0" size={20} /><div><strong>Authorized Admin.</strong> This browser has been verified for Riley or Veronica. RSVP data is still stored locally in this prototype; the shared production database is the next deployment step.</div></div>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div><p className="text-xs font-bold uppercase tracking-[0.25em] text-amber-700">Wedding Administration</p><h1 className="mt-1 font-serif text-4xl text-amber-950 md:text-5xl">RSVP Control Room</h1></div>
        <button onClick={refresh} className="inline-flex items-center justify-center gap-2 rounded-xl border border-amber-300 bg-white/90 px-4 py-2 text-sm font-semibold text-amber-900 hover:bg-amber-50"><RefreshCw size={16} /> Refresh</button>
      </div>

      <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Total Invited" value={stats.invited} icon={Users} />
        <Stat label="Attending" value={stats.attending} icon={CheckCircle2} />
        <Stat label="Declined" value={stats.declined} icon={AlertTriangle} />
        <Stat label="Pending" value={stats.pending} icon={Clock3} />
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-3">
        <MiniStat label="Invitation Groups" value={INVITATION_GROUPS.length} />
        <MiniStat label="Failed Lookups" value={stats.failedLookups} danger={stats.failedLookups > 0} />
        <MiniStat label="Party Limit Blocks" value={stats.blockedLimits} danger={stats.blockedLimits > 0} />
      </div>

      <div className="mt-8 overflow-hidden rounded-3xl border border-amber-200 bg-white/90 shadow-xl backdrop-blur-sm">
        <div className="border-b border-amber-200 p-5 sm:flex sm:items-center sm:justify-between sm:gap-4">
          <div><h2 className="font-serif text-2xl text-amber-950">Guest RSVP List</h2><p className="mt-1 text-sm text-stone-600">Names, invitation size, response status, and who submitted the response.</p></div>
          <input value={guestSearch} onChange={(e) => setGuestSearch(e.target.value)} placeholder="Search guest or group..." className="mt-4 w-full rounded-xl border border-amber-300 bg-white px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-amber-500 sm:mt-0 sm:max-w-xs" />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-left text-sm">
            <thead className="bg-amber-50 text-xs uppercase tracking-wider text-amber-900"><tr><th className="px-5 py-3">Guest</th><th className="px-5 py-3">Invitation</th><th className="px-5 py-3">Group Size</th><th className="px-5 py-3">Status</th><th className="px-5 py-3">Submitted By</th><th className="px-5 py-3">Updated</th></tr></thead>
            <tbody className="divide-y divide-amber-100">
              {guestRows.map((row) => <tr key={row.id} className="hover:bg-amber-50/60"><td className="px-5 py-4 font-semibold text-stone-900">{row.firstName} {row.lastName}</td><td className="px-5 py-4 text-stone-600">{row.invitationLabel}</td><td className="px-5 py-4 text-stone-600">{row.invitationSize}</td><td className="px-5 py-4"><StatusPill status={row.response?.status || "pending"} /></td><td className="px-5 py-4 text-stone-600">{row.response?.submittedByName || "—"}</td><td className="px-5 py-4 text-stone-600">{fmt(row.response?.updatedAt)}</td></tr>)}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-8 overflow-hidden rounded-3xl border border-amber-200 bg-white/90 shadow-xl backdrop-blur-sm">
        <div className="flex flex-col gap-4 border-b border-amber-200 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div><h2 className="font-serif text-2xl text-amber-950">System Log</h2><p className="mt-1 text-sm text-stone-600">Lookups, RSVP submissions, validation blocks, and application errors.</p></div>
          <div className="flex flex-wrap gap-2">{["ALL", "INFO", "WARN", "ERROR"].map((x) => <button key={x} onClick={() => setFilter(x)} className={`rounded-lg px-3 py-1.5 text-xs font-bold ${filter === x ? "bg-amber-700 text-white" : "bg-amber-100 text-amber-900"}`}>{x}</button>)}<button onClick={() => { if (window.confirm("Clear the local RSVP audit log?")) { clearAuditLog(); refresh(); } }} className="inline-flex items-center gap-1 rounded-lg bg-stone-100 px-3 py-1.5 text-xs font-bold text-stone-700 hover:bg-stone-200"><Trash2 size={13} /> Clear</button></div>
        </div>
        <div className="overflow-x-auto"><table className="w-full min-w-[760px] text-left text-sm"><thead className="bg-amber-50 text-xs uppercase tracking-wider text-amber-900"><tr><th className="px-5 py-3">Time</th><th className="px-5 py-3">Level</th><th className="px-5 py-3">Guest / Entry</th><th className="px-5 py-3">Event</th><th className="px-5 py-3">Details</th></tr></thead><tbody className="divide-y divide-amber-100">{filteredEvents.map((e) => <tr key={e.id} className="align-top hover:bg-amber-50/60"><td className="whitespace-nowrap px-5 py-4 text-stone-600">{fmt(e.createdAt)}</td><td className="px-5 py-4"><span className={`rounded-full border px-2 py-1 text-xs font-bold ${levelClasses[e.level] || levelClasses.INFO}`}>{e.level}</span></td><td className="px-5 py-4 font-semibold text-stone-900">{e.guestName || e.enteredName || "—"}</td><td className="px-5 py-4 font-mono text-xs font-semibold text-amber-900">{e.eventType}</td><td className="px-5 py-4 text-stone-600">{renderMetadata(e.metadata)}</td></tr>)}{!filteredEvents.length && <tr><td colSpan="5" className="px-5 py-12 text-center text-stone-500">No log events yet.</td></tr>}</tbody></table></div>
      </div>
    </section>
  );
}

function Stat({ label, value, icon: Icon }) { return <div className="rounded-2xl border border-amber-200 bg-white/90 p-5 shadow-sm"><Icon size={20} className="text-amber-700" /><div className="mt-3 text-3xl font-bold text-stone-900">{value}</div><div className="mt-1 text-sm font-semibold text-stone-600">{label}</div></div>; }
function MiniStat({ label, value, danger = false }) { return <div className={`rounded-xl border px-4 py-3 ${danger ? "border-red-200 bg-red-50/90" : "border-amber-200 bg-amber-50/85"}`}><div className="text-xs font-bold uppercase tracking-wider text-stone-500">{label}</div><div className={`mt-1 text-lg font-bold ${danger ? "text-red-700" : "text-stone-900"}`}>{value}</div></div>; }
function StatusPill({ status }) { const cls = status === "accepted" ? "bg-emerald-100 text-emerald-800" : status === "declined" ? "bg-stone-200 text-stone-700" : "bg-amber-100 text-amber-800"; return <span className={`rounded-full px-2.5 py-1 text-xs font-bold uppercase tracking-wide ${cls}`}>{status === "accepted" ? "Attending" : status === "declined" ? "Declined" : "Pending"}</span>; }
function renderMetadata(metadata = {}) { const pieces = []; if (metadata.partySize != null) pieces.push(`attending ${metadata.partySize}`); if (metadata.maxPartySize != null) pieces.push(`max ${metadata.maxPartySize}`); if (metadata.invitationSize != null) pieces.push(`invite size ${metadata.invitationSize}`); if (metadata.attempted != null) pieces.push(`attempted ${metadata.attempted}`); if (metadata.message) pieces.push(metadata.message); return pieces.length ? pieces.join(" • ") : "—"; }
