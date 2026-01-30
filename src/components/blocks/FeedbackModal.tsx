"use client";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/Button";
import { Textarea } from "@/components/ui/Textarea";
import { 
  AlertCircle, 
  Calendar, 
  Frown, 
  Target, 
  FileText, 
  AlertTriangle,
  X 
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/components/providers/UiProviders";

export type FeedbackOption = 
  | "inaccurate" 
  | "out_of_date" 
  | "harmful" 
  | "not_relevant" 
  | "formatting" 
  | "incomplete";

export type FeedbackModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit?: (options: FeedbackOption[], comment: string) => void;
};

const feedbackOptions: Array<{
  id: FeedbackOption;
  label: string;
  icon: typeof AlertCircle;
}> = [
  { id: "inaccurate", label: "Inaccurate", icon: AlertCircle },
  { id: "out_of_date", label: "Out of date", icon: Calendar },
  { id: "harmful", label: "Harmful or offensive", icon: Frown },
  { id: "not_relevant", label: "Not relevant", icon: Target },
  { id: "formatting", label: "Formatting issues", icon: FileText },
  { id: "incomplete", label: "Incomplete", icon: AlertTriangle },
];

export function FeedbackModal({ open, onOpenChange, onSubmit }: FeedbackModalProps) {
  const [selectedOptions, setSelectedOptions] = useState<FeedbackOption[]>([]);
  const [comment, setComment] = useState("");
  const showToast = useToast();

  const toggleOption = (option: FeedbackOption) => {
    setSelectedOptions((prev) =>
      prev.includes(option)
        ? prev.filter((o) => o !== option)
        : [...prev, option]
    );
  };

  const handleSubmit = () => {
    const canSubmit = selectedOptions.length > 0 || comment.trim().length > 0;
    if (!canSubmit) {
      showToast("Please select at least one reason or add a comment.");
      return;
    }
    onSubmit?.(selectedOptions, comment);
    showToast("Thanks for your feedback!");
    setSelectedOptions([]);
    setComment("");
    onOpenChange(false);
  };

  const handleSkip = () => {
    setSelectedOptions([]);
    setComment("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[92vw] sm:max-w-[720px] p-0 max-h-[85vh] overflow-hidden">
        <button
          onClick={() => onOpenChange(false)}
          className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </button>

        <div className="p-6 overflow-y-auto max-h-[80vh]">
          <DialogHeader className="mb-6 space-y-3 flex-col">
            <DialogTitle className="text-2xl font-semibold text-[--color-neutral-900]">
              Help us improve
            </DialogTitle>
            <DialogDescription className="text-[15px] text-[--color-neutral-600] block">
              Provide additional feedback on this answer. Select all that apply.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-3">
              {feedbackOptions.map((option) => {
                const Icon = option.icon;
                const isSelected = selectedOptions.includes(option.id);
                return (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => toggleOption(option.id)}
                    className={cn(
                      "flex items-center gap-3 px-4 py-3 rounded-lg border-2 transition-all text-left",
                      isSelected
                        ? "border-blue-500 bg-blue-50"
                        : "border-[--color-neutral-200] bg-white hover:border-[--color-neutral-300]"
                    )}
                  >
                    <Icon
                      className={cn(
                        "w-5 h-5 flex-shrink-0",
                        isSelected ? "text-blue-600" : "text-[--color-neutral-600]"
                      )}
                    />
                    <span
                      className={cn(
                        "text-[15px]",
                        isSelected
                          ? "text-blue-700 font-medium"
                          : "text-[--color-neutral-900]"
                      )}
                    >
                      {option.label}
                    </span>
                  </button>
                );
              })}
            </div>
            <div className="space-y-3">
              <label
                htmlFor="feedback-comment"
                className="text-[15px] font-medium text-[--color-neutral-900]"
              >
                How can the response be improved?{" "}
                <span className="text-[--color-neutral-600] font-normal">(optional)</span>
              </label>
              <Textarea
                id="feedback-comment"
                placeholder="Your feedback..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="min-h-[100px] resize-none text-[15px] mt-5"
              />
            </div>
          </div>

          <DialogFooter className="mt-6 flex gap-3 sm:justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={handleSkip}
              className="px-6"
            >
              Skip
            </Button>
            <Button
              type="button"
              onClick={handleSubmit}
              className="px-6 bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-60 disabled:cursor-not-allowed"
              disabled={selectedOptions.length === 0 && comment.trim().length === 0}
            >
              Submit
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}