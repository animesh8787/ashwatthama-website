import { Eye, Shield, Brain, Lock } from "lucide-react";
import { SectionHeader } from "@/components/ui/section-header";
import { Reveal } from "@/components/ui/reveal";
import { SpotlightGrid } from "@/components/ui/spotlight";

const reasons = [
  {
    icon: Eye,
    title: "Cloud AI watches you.",
    desc: "Every conversation you have with a cloud assistant is recorded, analyzed and stored on someone else's servers. Your thoughts become a product.",
  },
  {
    icon: Shield,
    title: "Ashwatthama protects you.",
    desc: "Your voice never leaves your machine. Your memories stay in your home. Your data is yours alone: encrypted, local and invisible to the world.",
  },
  {
    icon: Brain,
    title: "Intelligence without compromise.",
    desc: "You shouldn't have to choose between powerful AI and privacy. Ashwatthama proves you can have both: a genuine reasoning companion that lives entirely on your hardware.",
  },
  {
    icon: Lock,
    title: "Forever yours.",
    desc: "No subscriptions. No usage limits. No vendor lock-in. Download once, own it forever. Always present, never demanding tribute.",
  },
];

export function WhyAshwatthamaSection() {
  return (
    <section className="section" aria-labelledby="why-title">
      <div className="wrap">
        <SectionHeader
          eyebrow="Why it exists"
          titleId="why-title"
          title={
            <>
              Intelligence should serve <span className="accent">the individual.</span>
            </>
          }
          subtitle="The world has accepted that AI must live in the cloud. We reject that premise."
        />

        <Reveal>
          <SpotlightGrid className="md:grid-cols-2">
            {reasons.map((r) => (
              <div
                key={r.title}
                className="spot bg-obsidian-raised p-7 transition-colors duration-200 md:p-10"
              >
                <r.icon size={26} className="mb-6 text-ember" strokeWidth={1.4} aria-hidden="true" />
                <h3 className="h3 mb-3">{r.title}</h3>
                <p className="body-text max-w-[46ch] text-[0.9688rem]">{r.desc}</p>
              </div>
            ))}
          </SpotlightGrid>
        </Reveal>
      </div>
    </section>
  );
}
