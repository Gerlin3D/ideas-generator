import { cn } from "@/lib/utils";

type ScrollAreaProps = {
  children?: React.ReactNode;
  className?: string;
  containerId?: string;
};

export function ScrollArea({
  children,
  className,
  containerId,
}: ScrollAreaProps) {
  return (
    <div
      data-scroll-container={containerId}
      className={cn("lab-scrollbar", className)}
    >
      {children}
    </div>
  );
}
