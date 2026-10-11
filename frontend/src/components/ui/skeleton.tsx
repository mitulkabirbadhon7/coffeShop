import { cn } from "@/lib/utils/cn";

export function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-md bg-[#6B4423]/25 border border-[#C89B5E]/10",
        className
      )}
      {...props}
    />
  );
}
