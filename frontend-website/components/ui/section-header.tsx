import { cn } from "@/lib/utils";
import { Reveal } from "@/components/ui/reveal";

interface SectionHeaderProps {
  eyebrow: string;
  title: React.ReactNode;
  subtitle?: string;
  className?: string;
  align?: "left" | "center";
  /** Applied to the <h2> so sections can wire aria-labelledby to it. */
  titleId?: string;
}

export function SectionHeader({
  eyebrow,
  title,
  subtitle,
  className,
  align = "left",
  titleId,
}: SectionHeaderProps) {
  return (
    <Reveal
      className={cn(
        "mb-12 md:mb-16 max-w-[44rem]",
        align === "center" && "mx-auto text-center flex flex-col items-center",
        className
      )}
    >
      <div className="eyebrow mb-5">{eyebrow}</div>
      <h2 className="h2" id={titleId}>
        {title}
      </h2>
      {subtitle && <p className="lede mt-5 max-w-[52ch]">{subtitle}</p>}
    </Reveal>
  );
}
