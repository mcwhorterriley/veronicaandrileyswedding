const KNOT_RSVP_URL = "https://theknot.com/rileylovesveronica/rsvp";

export default function DetailsPage() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-8">
      <div className="rounded-2xl bg-amber-50/85 backdrop-blur-sm ring-1 ring-amber-200 shadow p-5 md:p-6">

        <h2 className="font-serif text-3xl md:text-4xl text-amber-800 mb-5 text-center">
          Wedding Information
        </h2>

        <div className="grid gap-4 md:grid-cols-2">

          {/* Ceremony & Reception */}
          <div className="rounded-2xl bg-amber-50/70 border border-amber-200 p-4 shadow-sm">
            <h3 className="font-serif text-xl text-amber-800 mb-2">
              Ceremony & Reception
            </h3>

            <div className="space-y-1 text-sm text-stone-800 leading-relaxed">
              <p>
                <strong>Date:</strong> November 14, 2026
              </p>

              <p>
                <strong>Time:</strong> Ceremony time coming soon
              </p>

              <p>
                <strong>Location:</strong> The Oaks Wedding and Event Center
              </p>

              <p>
                <strong>Address:</strong> 18444 LA-22, Ponchatoula, LA 70454
              </p>
            </div>
          </div>

          {/* Guest Details */}
          <div className="rounded-2xl bg-amber-50/70 border border-amber-200 p-4 shadow-sm">
            <h3 className="font-serif text-xl text-amber-800 mb-2">
              Guest Details
            </h3>

            <div className="space-y-1 text-sm text-stone-800 leading-relaxed">
              <p>
                <strong>STRICT:</strong> We love all the littles in our families;
                however, this is an <strong>ADULTS ONLY</strong> ceremony and
                reception. We love you and appreciate your respect.
              </p>

              <p>
                <strong>Attire:</strong> Cocktail | Formal
              </p>

              <p>
                <strong>Alcohol:</strong> Wine and beer will be provided, along
                with a cash bar for cocktails. Please plan ahead and arrange
                accommodations if needed.
              </p>

              <p>
                <strong>Parking:</strong> Plenty of parking on location.
              </p>
            </div>

            <a
              href="https://www.priceline.com/relax-ui/listings?destination=3000008467&checkIn=20261114&checkOut=20261115&rooms=1&adults=2"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-flex rounded-xl bg-amber-200/80 hover:bg-amber-300 text-amber-900 font-semibold px-4 py-2 text-sm shadow transition border border-amber-300"
            >
              Find Nearby Hotels
            </a>
          </div>
        </div>

        {/* Bottom RSVP Reminder */}
        <div className="mt-8 pt-6 border-t border-amber-200 text-center">
          <h3 className="font-serif text-2xl text-amber-950">
            Ready to RSVP?
          </h3>

          <p className="mt-2 text-sm text-stone-600">
            RSVP for your party here.
          </p>

          <a
            href={KNOT_RSVP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-5 inline-flex items-center justify-center rounded-xl bg-[#DAA520] px-7 py-3 font-semibold text-white shadow-lg transition hover:bg-[#b88918]"
          >
            Click Me, to RSVP!
          </a>
        </div>

        <p className="mt-5 text-center text-sm italic text-amber-800">
          Most importantly, have fun, be safe, and drink responsibly.
        </p>

      </div>
    </section>
  );
}