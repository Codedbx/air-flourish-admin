"use client"
import * as React from "react"
import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"

interface DatePickerProps {
  date: Date | undefined
  onSelect: (date: Date) => void
  disabledBefore?: Date
}

export function DatePicker({ date, onSelect, disabledBefore }: DatePickerProps) {
  const [open, setOpen] = React.useState(false)
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="w-full justify-between font-normal text-left"
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, "PPP") : "Select date"}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={date}
          onSelect={(d) => {
            if (d) {
              onSelect(d)
              setOpen(false)
            }
          }}
          disabled={(d) => !!disabledBefore && d < (disabledBefore as Date)}
          captionLayout="dropdown"
        />
      </PopoverContent>
    </Popover>
  )
}
