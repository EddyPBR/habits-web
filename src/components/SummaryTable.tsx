import { useEffect, useState } from "react";

import dayjs from "dayjs";
import { getSummary } from "../api/getSummary";

import { HabitDay } from "./HabitDay";

import { generateDatesFromYearBeginning } from "../utils/generate-dates-from-year-beginning";

const weekDays = ["D", "S", "T", "Q", "Q", "S", "S"];

const summaryDates = generateDatesFromYearBeginning();

const minimumSummaryDatesSize = 18 * 7; // 18 weeks
const amountOfDaysToFill = minimumSummaryDatesSize - summaryDates.length;

interface ISummary {
  id: string;
  date: string;
  amount: number;
  completed: number;
}

export function SummaryTable() {
  const [summary, setSummary] = useState<ISummary[]>([]);

  async function loadSummaries() {
    try {
      const { data } = await getSummary();
      setSummary(data);
    } catch (error: any) {
      console.error(error.message);
    }
  }

  useEffect(() => {
    return () => {
      loadSummaries();
    };
  }, []);

  return (
    <div className="w-full flex">
      <div className="grid grid-rows-7 grid-flow-row gap-3">
        {weekDays.map((weekDay, index) => {
          return (
            <div
              key={`${weekDay}-${index}`}
              className="text-zinc-400 text-xl h-10 w-10 font-bold flex items-center justify-center"
            >
              {weekDay}
            </div>
          );
        })}
      </div>

      <div className="grid grid-rows-7 grid-flow-col gap-3">
        {summary.length > 0 &&
          summaryDates.map((summaryDate) => {
            const dayInSummary = summary.find((day) => {
              return dayjs(summaryDate).isSame(day.date, "day");
            });

            return (
              <HabitDay
                key={summaryDate.toString()}
                date={summaryDate}
                amount={dayInSummary?.amount}
                defaultCompleted={dayInSummary?.completed}
              />
            );
          })}

        {amountOfDaysToFill > 0 &&
          Array.from({ length: amountOfDaysToFill }).map((_, index) => {
            return (
              <div
                key={index}
                className="w-10 h-10 bg-zinc-900 border-2 border-zinc-800 rounded-lg opacity-40 cursor-not-allowed"
              />
            );
          })}
      </div>
    </div>
  );
}
