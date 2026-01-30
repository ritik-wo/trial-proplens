"use client";
import { useState } from "react";
import { ThumbsUp, ThumbsDown, Copy } from "lucide-react";
import { Button } from "@/components/ui/Button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { FeedbackModal, type FeedbackOption } from "./FeedbackModal";
import { cn } from "@/lib/utils";
import { useToast } from "@/components/providers/UiProviders";

export type FeedbackFooterProps = {
  className?: string;
  wasHelpful?: "up" | "down" | null;
  onHelpfulChange?: (v: "up" | "down" | null) => void;
  onCopy?: () => void;
  valueLanguage?: string | undefined;
  onChangeLanguage?: (code: string) => void;
  isHistory?: boolean;
  labelHelpful?: string;
};

export function FeedbackFooter({
  className,
  wasHelpful = null,
  onHelpfulChange,
  onCopy,
  labelHelpful = "Was this helpful?",
}: FeedbackFooterProps) {
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const showToast = useToast();

  const handleThumbsDown = () => {
    if (wasHelpful === "down") {
      onHelpfulChange?.(null);
    } else {
      setShowFeedbackModal(true);
    }
  };

  const handleFeedbackSubmit = (options: FeedbackOption[], comment: string) => {
    console.log("feedback:not-helpful", { options, comment });
    onHelpfulChange?.("down");
    showToast("Thanks for your feedback!");
  };

  return (
    <>
      <FeedbackModal
        open={showFeedbackModal}
        onOpenChange={setShowFeedbackModal}
        onSubmit={handleFeedbackSubmit}
      />
      <div className={cn("flex items-center justify-between gap-4 pt-3", className)}>
        <div className="flex items-center gap-3">
          <span className="text-sm text-[--color-neutral-600]">{labelHelpful}</span>
          <TooltipProvider delayDuration={300}>
            <div className="flex items-center gap-2">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    type="button"
                    size="icon"
                    variant="outline"
                    aria-pressed={wasHelpful === "up"}
                    className={cn(
                      "h-8 w-8 transition-colors",
                      wasHelpful === "up"
                        ? "text-green-600 border-green-600 bg-green-50"
                        : "",
                      "hover:text-green-600 hover:border-green-600"
                    )}
                    onClick={() => {
                      onHelpfulChange?.(wasHelpful === "up" ? null : "up");
                    }}
                  >
                    <ThumbsUp className="w-3 h-3" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Helpful</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    type="button"
                    size="icon"
                    variant="outline"
                    aria-pressed={wasHelpful === "down"}
                    className={cn(
                      "h-8 w-8 transition-colors",
                      wasHelpful === "down"
                        ? "text-red-600 border-red-600 bg-red-50"
                        : "",
                      "hover:text-red-600 hover:border-red-600"
                    )}
                    onClick={handleThumbsDown}
                  >
                    <ThumbsDown className="w-3 h-3" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Not helpful</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    type="button"
                    size="icon"
                    variant="outline"
                    aria-label="Copy response"
                    className="h-8 w-8 transition-colors"
                    onClick={() => onCopy?.()}
                  >
                    <Copy className="w-3 h-3" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Copy response</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </TooltipProvider>
        </div>
      </div>
    </>
  );
}
