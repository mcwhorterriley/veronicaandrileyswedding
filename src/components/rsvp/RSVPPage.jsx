import { useState } from "react";
import { CheckCircle2, Search, XCircle } from "lucide-react";
import { findGuestByName } from "../../services/guestLookup.js";
import { writeRsvpSession } from "../../services/rsvpSession.js";

export default function RSVPPage({ onCompleted, onViewDetails }) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [matchedGuest, setMatchedGuest] = useState(null);
  const [error, setError] = useState("");
  const [submittedStatus, setSubmittedStatus] = useState(null);

  const handleLookup = (event) => {
    event.preventDefault();
    setError("");
    setSubmittedStatus(null);

    if (!firstName.trim() || !lastName.trim()) {
      setMatchedGuest(null);
      setError("Please enter both your first and last name.");
      return;
    }

    const guest = findGuestByName(firstName, lastName);
    if (!guest) {
      setMatchedGuest(null);
      setError("We could not find an invitation under that name. Please check the spelling or contact Veronica or Riley.");
      return;
    }

    setMatchedGuest(guest);
  };

  const submitRsvp = (status) => {
    const session = {
      guestId: matchedGuest.id,
      guestName: `${matchedGuest.firstName} ${matchedGuest.lastName}`,
      status,
      canViewDetails: status === "accepted",
      submittedAt: new Date().toISOString(),
    };

    writeRsvpSession(session);
    setSubmittedStatus(status);
    onCompleted(session);
  };

  const resetLookup = () => {
    setMatchedGuest(null);
    setSubmittedStatus(null);
    setError("");
    setFirstName("");
    setLastName("");
  };

  return (
    <section className="mx-auto max-w-2xl px-4 py-12">
      <div className="rounded-3xl bg-amber-50/90 backdrop-blur-sm ring-1 ring-amber-200 shadow-xl p-6 md:p-10">
        <div className="text-center mb-8">
          <p className="text-xs uppercase tracking-[0.28em] text-amber-700 mb-2">November 14, 2026</p>
          <h2 className="font-serif text-4xl md:text-5xl text-amber-900">RSVP</h2>
          <p className="mt-3 text-stone-700">Find your invitation using the name printed on your envelope.</p>
        </div>

        {!matchedGuest && (
          <form onSubmit={handleLookup} className="space-y-5">
            <div>
              <label htmlFor="rsvp-first-name" className="block text-sm font-semibold text-amber-900 mb-2">First name</label>
              <input id="rsvp-first-name" value={firstName} onChange={(event) => setFirstName(event.target.value)} autoComplete="given-name" className="w-full rounded-xl border border-amber-300 bg-white/90 px-4 py-3 text-stone-900 outline-none focus:ring-2 focus:ring-amber-500" />
            </div>
            <div>
              <label htmlFor="rsvp-last-name" className="block text-sm font-semibold text-amber-900 mb-2">Last name</label>
              <input id="rsvp-last-name" value={lastName} onChange={(event) => setLastName(event.target.value)} autoComplete="family-name" className="w-full rounded-xl border border-amber-300 bg-white/90 px-4 py-3 text-stone-900 outline-none focus:ring-2 focus:ring-amber-500" />
            </div>
            {error && <div role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">{error}</div>}
            <button type="submit" className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-[#DAA520] px-5 py-3 font-semibold text-white shadow hover:bg-[#b88918] transition"><Search size={18} /> Find My Invitation</button>
          </form>
        )}

        {matchedGuest && !submittedStatus && (
          <div className="text-center">
            <CheckCircle2 className="mx-auto text-emerald-600" size={46} />
            <h3 className="mt-4 font-serif text-3xl text-amber-900">Welcome, {matchedGuest.firstName}!</h3>
            <p className="mt-2 text-stone-700">We found your invitation. Will you be joining us?</p>
            <div className="mt-7 grid gap-3 sm:grid-cols-2">
              <button onClick={() => submitRsvp("accepted")} className="rounded-xl bg-emerald-700 px-5 py-3 font-semibold text-white shadow hover:bg-emerald-800 transition">Joyfully Accept</button>
              <button onClick={() => submitRsvp("declined")} className="rounded-xl bg-stone-700 px-5 py-3 font-semibold text-white shadow hover:bg-stone-800 transition">Regretfully Decline</button>
            </div>
            <button onClick={resetLookup} className="mt-5 text-sm text-amber-800 underline underline-offset-4">That is not me</button>
          </div>
        )}

        {submittedStatus && (
          <div className="text-center">
            {submittedStatus === "accepted" ? (
              <CheckCircle2 className="mx-auto text-emerald-600" size={52} />
            ) : (
              <XCircle className="mx-auto text-stone-500" size={52} />
            )}

            <h3 className="mt-4 font-serif text-3xl text-amber-900">
              {submittedStatus === "accepted"
                ? `Thank you, ${matchedGuest.firstName}!`
                : `Thank you, ${matchedGuest.firstName}.`}
            </h3>

            <p className="mt-3 text-stone-700">
              {submittedStatus === "accepted"
                ? "Your RSVP has been recorded. Click below to access the Details tab."
                : "Your RSVP has been recorded. We are sorry you cannot make it, and we appreciate you letting us know."}
            </p>

            {submittedStatus === "accepted" && (
              <button
                type="button"
                onClick={onViewDetails}
                className="mt-7 inline-flex items-center justify-center rounded-xl bg-[#DAA520] px-6 py-3 font-semibold text-white shadow transition hover:bg-[#b88918]"
              >
                View Wedding Details
              </button>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
