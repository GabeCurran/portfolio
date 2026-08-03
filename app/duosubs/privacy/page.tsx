import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "DuoSubs Privacy Policy",
  description:
    "Privacy policy for the DuoSubs Chrome extension. No accounts, no analytics, no data collection.",
  robots: { index: true, follow: false },
};

export default function DuoSubsPrivacyPage() {
  return (
    <main className="mx-auto max-w-2xl px-6 py-16">
      <h1 className="text-3xl font-bold">DuoSubs Privacy Policy</h1>
      <p className="mt-2 text-sm opacity-70">Last updated: August 3, 2026</p>

      <div className="mt-8 space-y-6">
        <section>
          <h2 className="text-xl font-semibold">Summary</h2>
          <p className="mt-2">
            DuoSubs does not collect, transmit, sell, or share any user data.
            There are no accounts, no analytics, and no tracking of any kind.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold">What the extension stores</h2>
          <p className="mt-2">
            Subtitle tracks you load and your display settings (position, font,
            colors, timing offsets) are saved locally in your browser using
            Chrome&apos;s extension storage so they persist between sessions.
            This data never leaves your machine and is deleted when you remove
            the extension.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold">Page access</h2>
          <p className="mt-2">
            The extension runs on pages you visit only to locate video elements
            and draw your subtitles over them. It does not read, record, or
            transmit page content.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold">Network requests</h2>
          <p className="mt-2">
            The only optional network request the extension makes is loading a
            Google Fonts stylesheet if you choose a non-system font for your
            subtitles. No other requests are made.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold">Contact</h2>
          <p className="mt-2">
            Questions about this policy: gabecurran01@gmail.com
          </p>
        </section>
      </div>
    </main>
  );
}
