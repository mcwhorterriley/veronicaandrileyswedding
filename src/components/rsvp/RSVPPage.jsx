import { useMemo, useState } from "react";
import { CheckCircle2, Search, UserCheck, Users, XCircle } from "lucide-react";
import { findInvitationMemberByName } from "../../services/guestLookup.js";
import { readRsvpResponses, writeMemberResponse } from "../../services/rsvpResponses.js";
import { writeRsvpSession } from "../../services/rsvpSession.js";
import { writeAuditEvent } from "../../services/rsvpAudit.js";
import { isAdminMember, remainingAdminAttempts, verifyAdminEmail } from "../../services/adminAuth.js";

const fullName = (member) => `${member.firstName} ${member.lastName}`;

export default function RSVPPage({ onCompleted, onViewDetails }) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [match, setMatch] = useState(null);
  const [mode, setMode] = useState(null); // self | group
  const [selectedIds, setSelectedIds] = useState([]);
  const [error, setError] = useState("");
  const [completeMessage, setCompleteMessage] = useState("");
  const [submittedStatus, setSubmittedStatus] = useState(null);
  const [responseVersion, setResponseVersion] = useState(0);
  const [showAdminAccess, setShowAdminAccess] = useState(false);
  const [adminEmail, setAdminEmail] = useState("");
  const [adminError, setAdminError] = useState("");

  const responses = useMemo(() => {
    responseVersion;
    return readRsvpResponses();
  }, [responseVersion]);

  const handleLookup = (event) => {
    event.preventDefault();
    setError("");
    setCompleteMessage("");
    setSubmittedStatus(null);

    if (!firstName.trim() || !lastName.trim()) {
      setMatch(null);
      setError("Please enter both your first and last name.");
      return;
    }

    const found = findInvitationMemberByName(firstName, lastName);
    if (!found) {
      setMatch(null);
      writeAuditEvent({
        level: "WARN",
        eventType: "LOOKUP_NOT_FOUND",
        enteredName: `${firstName.trim()} ${lastName.trim()}`,
      });
      setError("We couldn't find an invitation under that name. Please check the spelling, and if it still doesn't look right, reach out to Veronica or Riley and we'll take care of you.");
      return;
    }

    setMatch(found);
    setMode(null);
    setSelectedIds([found.member.id]);
    writeAuditEvent({
      level: "INFO",
      eventType: "LOOKUP_SUCCESS",
      guestName: fullName(found.member),
      metadata: { invitationSize: found.group.members.length },
    });
  };

  const submitSelf = (status) => {
    if (!match) return;
    try {
      writeMemberResponse({ member: match.member, group: match.group, status, submittedBy: match.member });
      writeAuditEvent({
        level: "INFO",
        eventType: status === "accepted" ? "RSVP_ACCEPTED" : "RSVP_DECLINED",
        guestName: fullName(match.member),
        metadata: { partySize: status === "accepted" ? 1 : 0, invitationSize: match.group.members.length },
      });
      finishSubmission(status, status === "accepted" ? 1 : 0, `Your RSVP has been recorded.`);
    } catch (err) {
      writeAuditEvent({ level: "ERROR", eventType: "RSVP_SAVE_FAILED", guestName: fullName(match.member), metadata: { message: err.message } });
      setError("Something went wrong while saving your RSVP. Please try again.");
    }
  };

  const submitGroup = () => {
    if (!match) return;
    const allowedIds = new Set(match.group.members.map((member) => member.id));
    const safeIds = selectedIds.filter((id) => allowedIds.has(id));

    if (safeIds.length > match.group.members.length) {
      writeAuditEvent({
        level: "WARN",
        eventType: "PARTY_LIMIT_BLOCKED",
        guestName: fullName(match.member),
        metadata: { attempted: safeIds.length, maxPartySize: match.group.members.length },
      });
      setError(`We'd love to celebrate with everyone, but this invitation is reserved for up to ${match.group.members.length} guests. Please choose only the people listed on this invitation.`);
      return;
    }

    if (!safeIds.length) {
      setError("Choose at least one person to include, or use “RSVP for myself” if you're only responding for yourself.");
      return;
    }

    try {
      const selected = match.group.members.filter((member) => safeIds.includes(member.id));
      selected.forEach((member) => {
        writeMemberResponse({ member, group: match.group, status: "accepted", submittedBy: match.member });
      });

      writeAuditEvent({
        level: "INFO",
        eventType: "GROUP_RSVP_ACCEPTED",
        guestName: fullName(match.member),
        metadata: { partySize: selected.length, maxPartySize: match.group.members.length },
      });
      finishSubmission("accepted", selected.length, `Your RSVP has been recorded for ${selected.length} ${selected.length === 1 ? "guest" : "guests"}.`);
    } catch (err) {
      writeAuditEvent({ level: "ERROR", eventType: "RSVP_SAVE_FAILED", guestName: fullName(match.member), metadata: { message: err.message } });
      setError("Something went wrong while saving your RSVP. Please try again.");
    }
  };

  const finishSubmission = (status, partySize, message) => {
    const session = {
      guestId: match.member.id,
      guestName: fullName(match.member),
      invitationId: match.group.id,
      status,
      partySize,
      maxPartySize: match.group.members.length,
      canViewDetails: status === "accepted",
      submittedAt: new Date().toISOString(),
    };
    writeRsvpSession(session);
    setResponseVersion((v) => v + 1);
    setSubmittedStatus(status);
    setCompleteMessage(message);
    onCompleted(session);
    if (isAdminMember(match.member.id)) setShowAdminAccess(true);
  };

  const handleAdminVerify = (event) => {
    event.preventDefault();
    setAdminError("");
    const result = verifyAdminEmail(match.member.id, adminEmail);
    if (result.ok) {
      window.location.href = "/admin";
      return;
    }
    if (result.configurationError) {
      setAdminError("Admin email has not been configured yet.");
      return;
    }
    if (result.locked) {
      setAdminError("Too many incorrect attempts. Admin access is locked on this browser.");
      return;
    }
    setAdminError(`That email doesn't match our admin record. ${result.remaining} ${result.remaining === 1 ? "try" : "tries"} remaining.`);
  };

  const toggleMember = (memberId) => {
    setSelectedIds((current) =>
      current.includes(memberId)
        ? current.filter((id) => id !== memberId)
        : [...current, memberId],
    );
    setError("");
  };

  const resetLookup = () => {
    setMatch(null);
    setMode(null);
    setSelectedIds([]);
    setError("");
    setCompleteMessage("");
    setSubmittedStatus(null);
    setFirstName("");
    setLastName("");
  };

  return (
    <section className="mx-auto max-w-2xl px-4 py-12">
      <div className="rounded-3xl bg-amber-50/90 p-6 shadow-xl ring-1 ring-amber-200 backdrop-blur-sm md:p-10">
        <div className="mb-8 text-center">
          <p className="mb-2 text-xs uppercase tracking-[0.28em] text-amber-700">November 14, 2026</p>
          <h2 className="font-serif text-4xl text-amber-900 md:text-5xl">RSVP</h2>
          <p className="mt-3 text-stone-700">Find your invitation using your first and last name.</p>
        </div>

        {!match && (
          <form onSubmit={handleLookup} className="space-y-5">
            <div>
              <label htmlFor="rsvp-first-name" className="mb-2 block text-sm font-semibold text-amber-900">First name</label>
              <input id="rsvp-first-name" value={firstName} onChange={(event) => setFirstName(event.target.value)} autoComplete="given-name" className="w-full rounded-xl border border-amber-300 bg-white/90 px-4 py-3 text-stone-900 outline-none focus:ring-2 focus:ring-amber-500" />
            </div>
            <div>
              <label htmlFor="rsvp-last-name" className="mb-2 block text-sm font-semibold text-amber-900">Last name</label>
              <input id="rsvp-last-name" value={lastName} onChange={(event) => setLastName(event.target.value)} autoComplete="family-name" className="w-full rounded-xl border border-amber-300 bg-white/90 px-4 py-3 text-stone-900 outline-none focus:ring-2 focus:ring-amber-500" />
            </div>
            {error && <div role="alert" className="rounded-xl border border-amber-300 bg-amber-100 px-4 py-3 text-sm text-amber-950">{error}</div>}
            <button type="submit" className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#DAA520] px-5 py-3 font-semibold text-white shadow transition hover:bg-[#b88918]"><Search size={18} /> Find My Invitation</button>
          </form>
        )}

        {match && !submittedStatus && (
          <div>
            <div className="text-center">
              <CheckCircle2 className="mx-auto text-emerald-600" size={46} />
              <h3 className="mt-4 font-serif text-3xl text-amber-900">Welcome, {match.member.firstName}!</h3>
              <p className="mt-2 text-stone-700">We found your invitation for up to {match.group.members.length} {match.group.members.length === 1 ? "guest" : "guests"}.</p>
            </div>

            <div className="mt-6 rounded-2xl border border-amber-200 bg-white/70 p-4">
              <p className="mb-3 text-xs font-bold uppercase tracking-[0.14em] text-amber-800">Your invitation</p>
              <div className="space-y-2">
                {match.group.members.map((member) => {
                  const response = responses[member.id];
                  return (
                    <div key={member.id} className="flex items-center justify-between gap-3 rounded-xl bg-amber-50 px-3 py-2">
                      <span className="font-medium text-stone-800">{fullName(member)}</span>
                      <span className={`text-xs font-bold uppercase tracking-wide ${response?.status === "accepted" ? "text-emerald-700" : response?.status === "declined" ? "text-stone-500" : "text-amber-700"}`}>
                        {response?.status === "accepted" ? "Attending" : response?.status === "declined" ? "Declined" : "Pending"}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {!mode && (
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                <button onClick={() => setMode("self")} className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-700 px-5 py-3 font-semibold text-white shadow transition hover:bg-emerald-800"><UserCheck size={18} /> RSVP for myself</button>
                {match.group.members.length > 1 && <button onClick={() => setMode("group")} className="inline-flex items-center justify-center gap-2 rounded-xl bg-amber-700 px-5 py-3 font-semibold text-white shadow transition hover:bg-amber-800"><Users size={18} /> RSVP for my party</button>}
              </div>
            )}

            {mode === "self" && (
              <div className="mt-6 rounded-2xl border border-amber-200 bg-white/70 p-5 text-center">
                <p className="text-stone-700">Will you be joining us?</p>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <button onClick={() => submitSelf("accepted")} className="rounded-xl bg-emerald-700 px-5 py-3 font-semibold text-white shadow hover:bg-emerald-800">Joyfully Accept</button>
                  <button onClick={() => submitSelf("declined")} className="rounded-xl bg-stone-700 px-5 py-3 font-semibold text-white shadow hover:bg-stone-800">Regretfully Decline</button>
                </div>
              </div>
            )}

            {mode === "group" && (
              <div className="mt-6 rounded-2xl border border-amber-200 bg-white/70 p-5">
                <h4 className="font-serif text-2xl text-amber-900">Who are you including?</h4>
                <p className="mt-1 text-sm text-stone-600">Select everyone from this invitation who will be attending. Anyone left unselected stays pending and can RSVP later.</p>
                <div className="mt-4 space-y-2">
                  {match.group.members.map((member) => {
                    const checked = selectedIds.includes(member.id);
                    return (
                      <label key={member.id} className={`flex cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 transition ${checked ? "border-emerald-300 bg-emerald-50" : "border-amber-200 bg-amber-50"}`}>
                        <input type="checkbox" checked={checked} onChange={() => toggleMember(member.id)} className="h-4 w-4 accent-emerald-700" />
                        <span className="font-medium text-stone-800">{fullName(member)}</span>
                      </label>
                    );
                  })}
                </div>
                <div className="mt-4 flex items-center justify-between rounded-xl bg-amber-50 px-4 py-3 text-sm">
                  <span className="font-semibold text-amber-900">Selected</span>
                  <span className="font-bold text-amber-900">{selectedIds.length} of {match.group.members.length}</span>
                </div>
                <button onClick={submitGroup} className="mt-4 w-full rounded-xl bg-emerald-700 px-5 py-3 font-semibold text-white shadow hover:bg-emerald-800">Submit Party RSVP</button>
              </div>
            )}

            {error && <div role="alert" className="mt-4 rounded-xl border border-amber-300 bg-amber-100 px-4 py-3 text-sm text-amber-950">{error}</div>}
            <div className="mt-5 flex justify-center gap-5 text-sm">
              {mode && <button onClick={() => { setMode(null); setError(""); }} className="text-amber-800 underline underline-offset-4">Back</button>}
              <button onClick={resetLookup} className="text-amber-800 underline underline-offset-4">That is not me</button>
            </div>
          </div>
        )}

        {match && submittedStatus && (
          <div className="text-center">
            {submittedStatus === "accepted" ? <CheckCircle2 className="mx-auto text-emerald-600" size={52} /> : <XCircle className="mx-auto text-stone-500" size={52} />}
            <h3 className="mt-4 font-serif text-3xl text-amber-900">Thank you, {match.member.firstName}!</h3>
            <p className="mt-3 text-stone-700">{completeMessage} {submittedStatus === "accepted" ? "Click below to access the Details tab." : "We appreciate you letting us know."}</p>
            {submittedStatus === "accepted" && <button type="button" onClick={onViewDetails} className="mt-7 inline-flex items-center justify-center rounded-xl bg-[#DAA520] px-6 py-3 font-semibold text-white shadow transition hover:bg-[#b88918]">View Wedding Details</button>}
          </div>
        )}
      </div>


      {showAdminAccess && match && isAdminMember(match.member.id) && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/55 px-4">
          <div className="w-full max-w-md rounded-3xl border border-amber-200 bg-white p-7 text-center shadow-2xl">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-amber-700">Admin Access</p>
            <h3 className="mt-2 font-serif text-3xl text-amber-950">Welcome, {match.member.firstName}</h3>
            <p className="mt-3 text-sm text-stone-600">Enter your admin email once to authorize this browser. After it matches, this device will go straight into the admin portal.</p>
            <form onSubmit={handleAdminVerify} className="mt-6">
              <input type="email" autoComplete="email" value={adminEmail} onChange={(e) => setAdminEmail(e.target.value)} placeholder="Email address" className="w-full rounded-xl border border-amber-300 px-4 py-3 outline-none focus:ring-2 focus:ring-amber-500" required />
              {adminError && <p className="mt-3 text-sm font-semibold text-red-700">{adminError}</p>}
              <button type="submit" disabled={remainingAdminAttempts(match.member.id) === 0} className="mt-5 w-full rounded-xl bg-amber-700 px-5 py-3 font-semibold text-white shadow hover:bg-amber-800 disabled:cursor-not-allowed disabled:opacity-50">Access Admin Portal</button>
            </form>
            <button type="button" onClick={() => setShowAdminAccess(false)} className="mt-4 text-sm font-semibold text-stone-500 hover:text-stone-800">Not right now</button>
          </div>
        </div>
      )}
    </section>
  );
}
