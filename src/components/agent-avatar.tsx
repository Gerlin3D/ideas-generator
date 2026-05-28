import Image from "next/image";
import { cn } from "@/lib/utils";

const agentAvatarConfig: Record<
  string,
  { src: string; alt: string; ringClassName: string }
> = {
  dreamer: {
    src: "/agents/dreamer.png",
    alt: "Dreamer agent avatar",
    ringClassName: "ring-sky-300/30",
  },
  builder: {
    src: "/agents/builder.png",
    alt: "Builder agent avatar",
    ringClassName: "ring-blue-300/25",
  },
  investor: {
    src: "/agents/investor.png",
    alt: "Investor agent avatar",
    ringClassName: "ring-emerald-300/30",
  },
  critic: {
    src: "/agents/critic.png",
    alt: "Critic agent avatar",
    ringClassName: "ring-amber-300/30",
  },
  finalEditor: {
    src: "/agents/final-editor.png",
    alt: "Final editor agent avatar",
    ringClassName: "ring-violet-300/25",
  },
};

export function AgentAvatar({
  agentKey,
  className,
}: {
  agentKey: string;
  className?: string;
}) {
  const config = agentAvatarConfig[agentKey];

  if (!config) {
    return (
      <div
        className={cn(
          "inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-slate-700/80 bg-slate-900/80 text-sm font-semibold text-slate-200",
          className,
        )}
      >
        ?
      </div>
    );
  }

  return (
    <div
      className={cn(
        "relative h-12 w-12 overflow-hidden rounded-2xl ring-1 ring-inset",
        config.ringClassName,
        className,
      )}
    >
      <Image
        src={config.src}
        alt={config.alt}
        fill
        sizes="48px"
        className="object-cover"
      />
    </div>
  );
}
