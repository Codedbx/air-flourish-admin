// import React from 'react';

// interface Option {
//   value: number; // Change to number
//   label: string;
// }

// interface MultiSelectProps {
//   options: Option[];
//   value: number[]; // Change to number[]
//   onValueChange: (value: number[]) => void; // Change to number[]
//   placeholder?: string;
// }

// export const MultiSelect: React.FC<MultiSelectProps> = ({
//   options,
//   value,
//   onValueChange,
//   placeholder = 'Select...'
// }) => {
//   const toggleOption = (optionValue: number) => {
//     if (value.includes(optionValue)) {
//       onValueChange(value.filter(v => v !== optionValue));
//     } else {
//       onValueChange([...value, optionValue]);
//     }
//   };

//   return (
//     <div className="border rounded-md p-2 min-h-[40px]">
//       {value.length === 0 && (
//         <span className="text-muted-foreground">{placeholder}</span>
//       )}
      
//       <div className="flex flex-wrap gap-2">
//         {options.map(option => (
//           <div key={option.value} className="flex items-center">
//             <input
//               type="checkbox"
//               id={`option-${option.value}`}
//               checked={value.includes(option.value)}
//               onChange={() => toggleOption(option.value)}
//               className="mr-2"
//             />
//             <label htmlFor={`option-${option.value}`}>{option.label}</label>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };


import React, { useState } from "react";
import { Check, ChevronsUpDown, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";

export type Option = {
  label: string;
  value: string;
};

export interface MultiSelectProps {
  options: Option[];
  value: string[];
  onValueChange: (value: string[]) => void;
  placeholder?: string;
  variant?: "default" | "inverted";
  maxCount?: number;
}

export function MultiSelect({
  options,
  value,
  onValueChange,
  placeholder = "Select options",
  variant = "default",
  maxCount,
}: MultiSelectProps) {
  const [open, setOpen] = useState(false);

  const handleSelect = (optionValue: string) => {
    if (value.includes(optionValue)) {
      onValueChange(value.filter((v) => v !== optionValue));
    } else {
      if (maxCount && value.length >= maxCount) {
        // If maxCount is reached, remove the first item and add the new one
        onValueChange([...value.slice(1), optionValue]);
      } else {
        onValueChange([...value, optionValue]);
      }
    }
  };

  const handleRemove = (optionValue: string) => {
    onValueChange(value.filter((v) => v !== optionValue));
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant={variant === "default" ? "outline" : "secondary"}
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between h-auto min-h-10 py-2"
        >
          <div className="flex flex-wrap gap-1">
            {value.length > 0 ? (
              value.map((selectedValue) => {
                const selectedOption = options.find(
                  (option) => option.value === selectedValue
                );
                return (
                  <Badge
                    key={selectedValue}
                    variant={variant === "default" ? "secondary" : "default"}
                    className="mr-1 mb-1"
                  >
                    {selectedOption?.label}
                    <button
                      className="ml-1 ring-offset-background rounded-full outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          handleRemove(selectedValue);
                        }
                      }}
                      onMouseDown={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                      }}
                      onClick={() => handleRemove(selectedValue)}
                    >
                      <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                    </button>
                  </Badge>
                );
              })
            ) : (
              <span className="text-muted-foreground">{placeholder}</span>
            )}
          </div>
          <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search..." />
          <CommandEmpty>No options found.</CommandEmpty>
          <CommandGroup className="max-h-64 overflow-auto">
            {options.map((option) => (
              <CommandItem
                key={option.value}
                value={option.value}
                onSelect={() => handleSelect(option.value)}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    value.includes(option.value) ? "opacity-100" : "opacity-0"
                  )}
                />
                {option.label}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}