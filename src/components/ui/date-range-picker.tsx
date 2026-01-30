"use client";
import * as React from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/Input";
import { Calendar as CalendarIcon } from "lucide-react";
import { format } from "date-fns";

type Range = { from?: Date; to?: Date };

export function DateRangePicker({ value, onChange, labels = false, labelsInline = false, inlineTo = true }: { value: Range; onChange: (r: Range) => void; labels?: boolean; labelsInline?: boolean; inlineTo?: boolean }) {
  const [openFrom, setOpenFrom] = React.useState(false);
  const [openTo, setOpenTo] = React.useState(false);
  const formatted = React.useMemo(() => {
    const fmt = (d?: Date) => (d ? format(d, "dd-MM-yyyy") : "");
    return { from: fmt(value.from), to: fmt(value.to) };
  }, [value]);

  return (
    <div className="flex items-end gap-3">
      <div className="inline-flex flex-col gap-2 min-w-0 flex-1 sm:flex-none">
        <label className="text-xs font-medium text-[--color-neutral-900] b-font">From</label>
        <Popover open={openFrom} onOpenChange={setOpenFrom}>
          <PopoverTrigger asChild>
            <button type="button" className="relative flex-1 sm:flex-none min-w-[120px]">
              <CalendarIcon className="hidden sm:block pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[--color-neutral-700]" aria-hidden="true" />
              <Input
                readOnly
                value={formatted.from}
                placeholder="dd-mm-yyyy"
                className="h-11 w-full sm:w-[170px] md:w-[220px] !pl-9 cursor-pointer"
                onClick={() => setOpenFrom(true)}
              />
            </button>
          </PopoverTrigger>
          <PopoverContent className="z-50 w-auto p-0 bg-white border rounded-md shadow-md text-base" align="start" sideOffset={8}>
            <Calendar
              className="rounded-sm"
              mode="single"
              selected={value.from}
              onSelect={(d: Date | undefined) => {
                if (!d) { onChange({ from: undefined, to: value.to }); return; }
                if (value.to && d > value.to) {
                  onChange({ from: d, to: d });
                } else {
                  onChange({ from: d, to: value.to });
                }
                setOpenFrom(false);
              }}
              showOutsideDays
              numberOfMonths={1}
            />
          </PopoverContent>
        </Popover>
      </div>

      <div className="inline-flex flex-col gap-2 min-w-0 flex-1 sm:flex-none">
        <label className="text-xs font-medium text-[--color-neutral-900] b-font">To</label>
        <Popover open={openTo} onOpenChange={setOpenTo}>
          <PopoverTrigger asChild>
            <button type="button" className="relative flex-1 sm:flex-none min-w-[120px]">
              <CalendarIcon className="hidden sm:block pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[--color-neutral-700]" aria-hidden="true" />
              <Input
                readOnly
                value={formatted.to}
                placeholder="dd-mm-yyyy"
                className="h-11 w-full sm:w-[170px] md:w-[220px] !pl-9 cursor-pointer"
                onClick={() => setOpenTo(true)}
              />
            </button>
          </PopoverTrigger>
          <PopoverContent className="z-50 w-auto p-0 bg-white border rounded-md shadow-md text-base" align="end" sideOffset={8}>
            <Calendar
              className="rounded-sm"
              mode="single"
              selected={value.to}
              onSelect={(d: Date | undefined) => {
                if (!d) { onChange({ from: value.from, to: undefined }); return; }
                if (value.from && d < value.from) {
                  onChange({ from: d, to: d });
                } else {
                  onChange({ from: value.from, to: d });
                }
                setOpenTo(false);
              }}
              showOutsideDays
              numberOfMonths={1}
            />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}
