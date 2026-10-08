import { Mail, ArrowUpRight, Download } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "@/components/ui/brand-icons";
import { Reveal } from "@/components/ui/reveal";
import { Button } from "@/components/ui/button";

const contacts = [
  {
    label: "Email",
    value: "workreachoutanimesh@gmail.com",
    href: "mailto:workreachoutanimesh@gmail.com",
    icon: <Mail size={18} aria-hidden="true" />,
    external: false,
  },
  {
    label: "LinkedIn",
    value: "Animesh Dhiman",
    href: "https://www.linkedin.com/in/animesh-dhiman-658250311/",
    icon: <LinkedinIcon className="h-[18px] w-[18px]" />,
    external: true,
  },
  {
    label: "GitHub",
    value: "animesh8787",
    href: "https://github.com/animesh8787",
    icon: <GithubIcon className="h-[18px] w-[18px]" />,
    external: true,
  },
];

export function ContactSection() {
  return (
    <>
      <section id="contact" className="section" aria-labelledby="contact-title">
        <div className="wrap">
          <Reveal className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <div className="eyebrow mb-5">Contact</div>
              <h2 className="h2" id="contact-title">
                Get in <span className="accent">touch.</span>
              </h2>
            </div>
            <p className="body-text max-w-[40ch]">
              Questions, feedback, bug reports or partnership ideas. Reach out any time.
            </p>
          </Reveal>

          <Reveal>
            <ul className="grid overflow-hidden rounded-2xl border border-border bg-border sm:grid-cols-3 sm:gap-px">
              {contacts.map((c) => (
                <li key={c.label} className="bg-obsidian-raised">
                  <a
                    href={c.href}
                    {...(c.external ? { target: "_blank", rel: "noreferrer" } : {})}
                    className="group flex h-full items-start justify-between gap-4 p-6 transition-colors duration-200 hover:bg-surface-hover md:p-8"
                  >
                    <span className="min-w-0">
                      <span className="eyebrow mb-4 block">{c.label}</span>
                      <span className="flex items-center gap-2.5 text-bone">
                        <span className="text-ember">{c.icon}</span>
                        <span className="truncate text-[1.0625rem] font-medium">{c.value}</span>
                      </span>
                    </span>
                    <ArrowUpRight
                      size={18}
                      className="mt-1 shrink-0 text-muted transition-[color,transform] duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-ember"
                      aria-hidden="true"
                    />
                    {c.external && <span className="sr-only"> (opens in new tab)</span>}
                  </a>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      {/* Closing call to action */}
      <section className="relative z-10 pb-24 md:pb-32" aria-label="Download">
        <div className="wrap">
          <Reveal>
            <div className="relative overflow-hidden rounded-3xl border border-border-mid bg-obsidian-raised px-6 py-16 text-center md:px-12 md:py-24">
              <div
                className="pointer-events-none absolute inset-0"
                style={{
                  background:
                    "radial-gradient(60% 90% at 50% 120%, rgba(var(--ember-rgb), 0.22), transparent 70%)",
                }}
                aria-hidden="true"
              />
              <div className="grid-lines pointer-events-none absolute inset-0 opacity-60" aria-hidden="true" />
              <div className="relative">
                <h2 className="h2 mx-auto max-w-[18ch]">
                  Ready to own your <span className="accent">AI?</span>
                </h2>
                <p className="lede mx-auto mt-5 max-w-[44ch]">
                  Create a free account and get the Windows installer. No subscription, ever.
                </p>
                <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
                  <Button href="/download/" size="lg" magnetic>
                    <Download size={17} />
                    Download for Windows
                  </Button>
                  <Button href="/signup/" variant="secondary" size="lg">
                    Create account
                  </Button>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
