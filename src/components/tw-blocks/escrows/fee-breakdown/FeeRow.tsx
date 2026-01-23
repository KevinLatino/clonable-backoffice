"use client";

import { cn } from "@/lib/utils";
import { LucideIcon, Info } from "lucide-react";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";

interface FeeRowProps {
  icon: LucideIcon;
  label: string;
  amount: string;
  percentage: string;
  variant?: "default" | "highlight" | "total";
  showPercentage?: boolean;
  tooltip?: string;
}

export const FeeRow = ({
  icon: Icon,
  label,
  amount,
  percentage,
  variant = "default",
  showPercentage = true,
  tooltip,
}: FeeRowProps) => {
  return (
    <div
      className={cn(
        "flex items-center justify-between p-3 rounded-lg border",
        variant === "default" && "bg-muted/50",
        variant === "highlight" && "bg-primary/5 border-primary/20",
        variant === "total" && "bg-muted",
      )}
    >
      <div className="flex items-center gap-2">
        <Icon
          className={cn(
            "h-4 w-4",
            variant === "highlight" ? "text-primary" : "text-primary",
          )}
        />
        <div className="flex flex-col">
          <div className="flex items-center gap-1">
            <span className="text-sm text-muted-foreground">{label}</span>
            {tooltip && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="h-3 w-3 text-muted-foreground cursor-help" />
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  <p>{tooltip}</p>
                </TooltipContent>
              </Tooltip>
            )}
          </div>
          <span
            className={cn(
              "font-medium",
              variant === "total" && "text-lg font-semibold",
            )}
          >
            {showPercentage ? percentage : amount}
          </span>
        </div>
      </div>
      <div
        className={cn(
          "text-sm text-muted-foreground",
          variant === "total" && "text-base font-medium",
        )}
      >
        {showPercentage ? amount : percentage}
      </div>
    </div>
  );
};
