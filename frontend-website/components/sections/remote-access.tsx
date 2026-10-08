import { Globe, Terminal, FolderOpen, Clipboard, ArrowRight, ShieldCheck } from "lucide-react";
import { SectionHeader } from "@/components/ui/section-header";
import { Reveal } from "@/components/ui/reveal";
import { SpotlightGrid } from "@/components/ui/spotlight";
import { Button } from "@/components/ui/button";

const capabilities = [
  {
    icon: Globe,
    title: "Remote desktop streaming",
    desc: "See and control your paired computer from anywhere. Real-time screen capture with low-latency WebRTC streaming: your desktop, in your pocket.",
  },
  {
    icon: Terminal,
    title: "Terminal execution",
    desc: "Run commands on your remote machine through a secure shell. Every command is authenticated, audited and sandboxed to your trusted devices only.",
  },
  {
    icon: FolderOpen,
    title: "File operations",
    desc: "Browse, download, upload, move and delete files on your remote system. Preview files and transfer them securely over your authenticated session.",
  },
  {
    icon: Clipboard,
    title: "Clipboard sync",
    desc: "Copy on your phone, paste on your desktop. Bi-directional clipboard sync keeps your workflow seamless across every screen you own.",
  },
];

export function RemoteAccessSection() {
  return (
    <section id="remote-access" className="section" aria-labelledby="remote-access-title">
      <div className="wrap">
        <SectionHeader
          eyebrow="Remote access"
          titleId="remote-access-title"
          title={
            <>
              Your computer, <span className="accent">anywhere.</span>
            </>
          }
          subtitle="Pair your desktop once, then control it from any browser or Android device. Two-layer authentication means your machine is never exposed to the world, only to you."
        />

        <Reveal>
          <SpotlightGrid className="sm:grid-cols-2">
            {capabilities.map((c) => (
              <article key={c.title} className="spot flex flex-col bg-obsidian-raised p-7 md:p-8">
                <c.icon size={24} className="mb-6 text-ember" strokeWidth={1.4} aria-hidden="true" />
                <h3 className="h3 mb-3">{c.title}</h3>
                <p className="body-text flex-1 text-[0.9688rem]">{c.desc}</p>
              </article>
            ))}
          </SpotlightGrid>
        </Reveal>

        <Reveal className="mt-6">
          <div className="flex flex-col gap-5 rounded-2xl border border-border bg-obsidian-raised p-6 md:flex-row md:items-center md:justify-between md:p-8">
            <div className="flex items-start gap-4">
              <ShieldCheck size={26} className="mt-0.5 shrink-0 text-ember" strokeWidth={1.4} aria-hidden="true" />
              <p className="body-text max-w-[62ch]">
                <span className="font-medium text-bone">Two-layer security.</span> Layer 1
                authenticates your identity. Layer 2 verifies your device with a unique access key.
                Both must pass before any remote command is executed, and every action is audited.
              </p>
            </div>
            <div className="flex shrink-0 flex-col items-start gap-2 md:items-end">
              <Button href="/remote-desktop/" variant="secondary">
                Learn more
                <ArrowRight size={16} />
              </Button>
              <p className="font-mono text-label text-muted">Arriving in Version 2</p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
