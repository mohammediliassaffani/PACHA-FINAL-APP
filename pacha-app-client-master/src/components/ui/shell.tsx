import { type VariantProps, cva } from "class-variance-authority";
import * as React from "react";

import { cn } from "@/lib/utils";

import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

const shellVariants = cva("grid items-center gap-8 pb-8 pt-6 md:py-4", {
  variants: {
    variant: {
      default: "",
      sidebar: "",
      centered: "mx-auto mb-16 mt-20 max-w-md justify-center",
      markdown: "container max-w-3xl gap-0 py-8 md:py-10 lg:py-10",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

interface ShellProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof shellVariants> {
  as?: React.ElementType;
}

function Shell({
  className,
  as: Comp = "section",
  variant,
  ...props
}: ShellProps) {
  return (
    <ScrollArea>
      <Comp className={cn(shellVariants({ variant }), className)} {...props} />
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
}

export { Shell, shellVariants };
