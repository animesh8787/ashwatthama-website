import {
  Globe,
  Monitor,
  Terminal,
  FolderOpen,
  Clipboard,
  Smartphone,
  Lock,
  ArrowLeft,
} from "lucide-react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/ui/reveal";
import { SpotlightGrid } from "@/components/ui/spotlight";

const capabilities = [
  {
    icon: Globe,
    title: "Web dashboard control",
    desc: "Open a browser on any device and see your desktop in real time. Move the mouse, click, type and launch apps as if you were sitting right in front of it.",
  },
  {
    icon: Monitor,
    title: "Screen viewing and input",
    desc: "Live screen capture with low-latency streaming. Full mouse tracking, left, right and middle clicks, scrolling and keyboard input, all routed securely to your desktop.",
  },
  {
    icon: Terminal,
    title: "Terminal execution",
    desc: "Open a secure shell session directly from the dashboard. Run commands, manage processes and inspect system output remotely with full audit logging.",
  },
  {
    icon: FolderOpen,
    title: "File access and management",
    desc: "Browse your entire file system, download documents, upload files, create folders and move items through an intuitive file manager.",
  },
  {
    icon: Clipboard,
    title: "Clipboard sync",
    desc: "Copy text on your phone and paste it on your desktop. Bi-directional clipboard sync keeps your workflow seamless across every screen you own.",
  },
  {
    icon: Smartphone,
    title: "Android companion app",
    desc: "A dedicated mobile app for one-tap remote control. Optimized touch input, gesture shortcuts and quick-action widgets for the most common commands.",
  },
];

export const metadata = {
  title: "Remote access — Ashwatthama",
  description:
    "Reach your Ashwatthama desktop from any browser or Android device. Arriving in Version 2.",
};

export default function RemoteDesktopPage() {
  return (
    <>
      <Navbar />
      <main id="main" className="relative">
        <div className="grid-lines absolute inset-x-0 top-0 h-[560px]" aria-hidden="true" />
        <section className="section relative pt-36 md:pt-44">
          <div className="wrap">
            <Reveal>
              <Button href="/" variant="ghost" size="sm" className="-ml-3 mb-10">
                <ArrowLeft size={14} />
                Back to home
              </Button>
              <div className="eyebrow mb-5">Remote access</div>
              <h1 className="h1" style={{ fontSize: "clamp(2.6rem, 1.4rem + 4.6vw, 5rem)" }}>
                Your computer, <span className="accent">anywhere.</span>
              </h1>
              <p className="lede mt-6 max-w-[52ch]">
                Once connected, your Ashwatthama desktop becomes reachable from any browser or a
                dedicated Android companion, giving you full control over your machine no matter
                where you are.
              </p>
            </Reveal>

            <Reveal className="mt-14 md:mt-20">
              <SpotlightGrid className="sm:grid-cols-2 lg:grid-cols-3">
                {capabilities.map((c) => (
                  <article key={c.title} className="spot flex flex-col bg-obsidian-raised p-7 md:p-8">
                    <c.icon size={24} className="mb-6 text-ember" strokeWidth={1.4} aria-hidden="true" />
                    <h2 className="h3 mb-3">{c.title}</h2>
                    <p className="body-text flex-1 text-[0.9688rem]">{c.desc}</p>
                  </article>
                ))}
              </SpotlightGrid>
            </Reveal>

            <Reveal className="mt-6">
              <div className="flex items-start gap-4 rounded-2xl border border-border bg-obsidian-raised p-6 md:p-8">
                <Lock size={24} className="mt-0.5 shrink-0 text-ember" strokeWidth={1.4} aria-hidden="true" />
                <p className="body-text max-w-[70ch]">
                  <span className="font-medium text-bone">Built with care.</span> Remote access to your
                  computer is powerful, so it won&apos;t ship until it has been thoroughly tested for
                  security. That&apos;s why it&apos;s arriving in Version&nbsp;2, not on day one.
                </p>
              </div>
            </Reveal>

            <Reveal className="mt-6">
              <div className="relative overflow-hidden rounded-3xl border border-ember-border bg-ember-dim px-6 py-14 text-center md:px-12 md:py-20">
                <h2 className="h2 mx-auto max-w-[18ch]">Coming in Version 2</h2>
                <p className="lede mx-auto mt-5 max-w-[48ch]">
                  Remote desktop and the Android companion app are scheduled for the Version 2
                  release. The security model comes first, before your machine is ever opened to
                  the network.
                </p>
                <div className="mt-8 flex justify-center">
                  <Button href="/" variant="secondary">
                    <ArrowLeft size={15} />
                    Back to home
                  </Button>
                </div>
              </div>
            </Reveal>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
