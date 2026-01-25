import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-pill border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        secondary: "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive: "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline: "text-foreground",
        golf: "border-transparent bg-golf-forest text-primary-foreground",
        d1: "border-transparent bg-golf-forest text-primary-foreground",
        d2: "border-transparent bg-emerald-600 text-primary-foreground",
        d3: "border-transparent bg-teal-600 text-primary-foreground",
        naia: "border-transparent bg-cyan-600 text-primary-foreground",
        juco: "border-transparent bg-sky-600 text-primary-foreground",
        ranking: "border-golf-gold/30 bg-golf-gold/10 text-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
