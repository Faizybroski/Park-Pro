// "use client";

// import { format } from "date-fns";
// import { CalendarIcon, Clock } from "lucide-react";

// import { Button } from "@/components/ui/button";
// import { Calendar } from "@/components/ui/calendar";
// import {
//   Popover,
//   PopoverContent,
//   PopoverTrigger,
// } from "@/components/ui/popover";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";

// type Props = {
//   value?: string;
//   onChange: (value: string) => void;
// };

// const generateTimeSlots = () => {
//   const slots: string[] = [];

//   for (let hour = 0; hour < 24; hour++) {
//     for (let min = 0; min < 60; min += 15) {
//       const h = hour.toString().padStart(2, "0");
//       const m = min.toString().padStart(2, "0");
//       slots.push(`${h}:${m}`);
//     }
//   }

//   return slots;
// };

// export function DateTimePicker({ value, onChange }: Props) {
//   const date = value ? new Date(value) : undefined;
//   const time = value
//     ? `${date?.getHours().toString().padStart(2, "0")}:${date
//         ?.getMinutes()
//         .toString()
//         .padStart(2, "0")}`
//     : "";

//   const updateDate = (selectedDate: Date | undefined) => {
//     if (!selectedDate) return;

//     const [h, m] = time ? time.split(":") : ["00", "00"];
//     selectedDate.setHours(Number(h));
//     selectedDate.setMinutes(Number(m));

//     onChange(selectedDate.toISOString());
//   };

//   const updateTime = (t: string) => {
//     if (!date) return;

//     const [h, m] = t.split(":");
//     const newDate = new Date(date);
//     newDate.setHours(Number(h));
//     newDate.setMinutes(Number(m));

//     onChange(newDate.toISOString());
//   };

//   const timeSlots = generateTimeSlots();

//   return (
//     <div className="flex flex-col sm:flex-row gap-3 w-full">
//       {/* Date Picker */}
//       <Popover>
//         <PopoverTrigger asChild>
//           <Button
//             variant="outline"
//             className="w-full sm:w-[65%] justify-start text-left font-normal h-11 bg-muted"
//           >
//             <CalendarIcon className="mr-2 h-4 w-4 text-muted-foreground" />
//             {date ? (
//               format(date, "PPP")
//             ) : (
//               <span className="text-muted-foreground">Pick a date</span>
//             )}
//           </Button>
//         </PopoverTrigger>

//         <PopoverContent
//           align="start"
//           className="w-auto p-0 rounded-xl border shadow-lg"
//         >
//           <Calendar
//             mode="single"
//             selected={date}
//             onSelect={updateDate}
//             initialFocus
//             className="rounded-xl"
//           />
//         </PopoverContent>
//       </Popover>

//       {/* Time Picker */}
//       <Select value={time} onValueChange={updateTime}>
//         <SelectTrigger className="w-full sm:w-[35%] h-11 bg-muted">
//           <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
//           <SelectValue placeholder="Select time" />
//         </SelectTrigger>

//         <SelectContent className="max-h-60 rounded-xl">
//           {timeSlots.map((slot) => (
//             <SelectItem key={slot} value={slot}>
//               {slot}
//             </SelectItem>
//           ))}
//         </SelectContent>
//       </Select>
//     </div>
//     // <div className="flex gap-2">
//     //   {/* Date Picker */}
//     //   <Popover>
//     //     <PopoverTrigger asChild>
//     //       <Button
//     //         variant="outline"
//     //         className="w-[60%] justify-start text-left font-normal"
//     //       >
//     //         <CalendarIcon className="mr-2 h-4 w-4" />
//     //         {date ? format(date, "PPP") : "Pick a date"}
//     //       </Button>
//     //     </PopoverTrigger>
//     //     <PopoverContent className="p-0">
//     //       <Calendar mode="single" selected={date} onSelect={updateDate} />
//     //     </PopoverContent>
//     //   </Popover>

//     //   {/* Time Picker */}
//     //   <Select value={time} onValueChange={updateTime}>
//     //     <SelectTrigger className="w-[40%]">
//     //       <Clock className="mr-2 h-4 w-4" />
//     //       <SelectValue placeholder="Time" />
//     //     </SelectTrigger>
//     //     <SelectContent className="max-h-60">
//     //       {timeSlots.map((slot) => (
//     //         <SelectItem key={slot} value={slot}>
//     //           {slot}
//     //         </SelectItem>
//     //       ))}
//     //     </SelectContent>
//     //   </Select>
//     // </div>
//   );
// }

"use client";

import { format } from "date-fns";
import { CalendarIcon, Clock } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

type Props = {
  value?: string;
  onChange: (value: string) => void;
};

const generateTimeSlots = () => {
  const slots: string[] = [];
  for (let hour = 0; hour < 24; hour++) {
    for (let min = 0; min < 60; min += 15) {
      const h = hour.toString().padStart(2, "0");
      const m = min.toString().padStart(2, "0");
      slots.push(`${h}:${m}`);
    }
  }
  return slots;
};

export function DateTimePicker({ value, onChange }: Props) {
  const parsed = value ? new Date(value) : undefined;

  const [date, setDate] = useState<Date | undefined>(parsed);
  const [time, setTime] = useState(
    parsed
      ? `${parsed.getHours().toString().padStart(2, "0")}:${parsed
          .getMinutes()
          .toString()
          .padStart(2, "0")}`
      : "",
  );

  const update = (d?: Date, t?: string) => {
    if (!d && !date) return;

    const finalDate = new Date(d || date!);
    const [h, m] = (t || time || "00:00").split(":");

    finalDate.setHours(Number(h));
    finalDate.setMinutes(Number(m));

    onChange(finalDate.toISOString());
  };

  const timeSlots = generateTimeSlots();

  return (
    <Popover>
      {/* SINGLE TRIGGER */}
      <PopoverTrigger asChild className="active:bg-primary">
        <Button
          variant="outline"
          className="w-full h-11 rounded-full justify-start text-left font-normal border border-primary-light/10 bg-input hover:bg-input active:bg-input data-[state=open]:bg-input"
        >
          <CalendarIcon className="mr-2 h-4 w-4 text-primary" />

          {date ? (
            <>
              <span className="text-primary">{format(date, "PPP")}</span>
              <span className="mx-2 text-primary">•</span>
              <Clock className="mr-1 h-4 w-4 text-primary" />
              <span className="text-primary">{time || "00:00"}</span>
            </>
          ) : (
            <span className="text-primary/80">Pick date & time</span>
          )}
        </Button>
      </PopoverTrigger>

      {/* COMBINED PANEL */}
      <PopoverContent align="start" className="p-0 rounded-xl shadow-lg w-auto">
        <div className="flex">
          {/* Calendar */}
          <div className="border-r p-2">
            <Calendar
              mode="single"
              selected={date}
              onSelect={(d) => {
                setDate(d);
                update(d, undefined);
              }}
              disabled={{ before: new Date() }}
              initialFocus
            />
          </div>

          {/* Time list */}
          <div className="p-3 w-40 max-h-72 overflow-y-auto">
            <p className="text-sm text-primary-light font-medium mb-2">
              Select time
            </p>

            <div className="flex flex-col gap-1">
              {timeSlots.map((slot) => (
                <button
                  key={slot}
                  onClick={() => {
                    setTime(slot);
                    update(undefined, slot);
                  }}
                  className={`text-sm px-3 py-2 rounded-md text-left hover:bg-muted ${
                    time === slot
                      ? "bg-primary text-white hover:bg-primary font-medium"
                      : ""
                  }`}
                >
                  {slot}
                </button>
              ))}
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
