import { useEffect, useState } from "react";
import * as CheckBox from "@radix-ui/react-checkbox";
import { Check } from "phosphor-react";
import { IDayHabitDTO } from "../@types/DTOs";
import dayjs from "dayjs";
import { getDayHabits } from "../api/getDayHabits";
import { patchToggleHabit } from "../api/patchToggleHabit";

interface IHabitsListProps {
  date: Date;
  onCompletedChanged: (completedAmount: number) => void;
}

interface IPossibleHabit {
  id: string;
  title: string;
  createdAt: Date;
}

interface IHabitsInfo {
  possibleHabits: IPossibleHabit[];
  completedHabits: string[];
}

function parseDayHabitToHabitsInfo(dayHabit: IDayHabitDTO) {
  const possibleHabits = dayHabit.possibleHabits.map((habit) => {
    return {
      id: habit.id,
      title: habit.title,
      createdAt: new Date(habit.created_at),
    };
  });

  const completedHabits = dayHabit.completedHabits ?? [];

  const habitsInfo = {
    possibleHabits,
    completedHabits,
  };

  return habitsInfo;
}

export function HabitsList({ date, onCompletedChanged }: IHabitsListProps) {
  const [habitsInfo, setHabitsInfo] = useState<IHabitsInfo | null>();

  async function loadHabits() {
    try {
      const response = await getDayHabits({ date });

      const habitsInfo = parseDayHabitToHabitsInfo(response.data);

      setHabitsInfo(habitsInfo);
    } catch (error: any) {
      alert(error.message);
    }
  }

  async function handleToggleHabit(habitId: string) {
    try {
      if (!habitsInfo) {
        throw new Error("Client error: impossível alterar hábito inexistente!");
      }

      await patchToggleHabit({ id: habitId });

      const isHabitAlreadyCompleted =
        habitsInfo.completedHabits.includes(habitId);

      let completedHabits: string[] = [];

      setHabitsInfo((current) => {
        if (!current) return null;

        if (isHabitAlreadyCompleted) {
          completedHabits = current.completedHabits.filter(
            (id) => id !== habitId
          );
        } else {
          completedHabits = [...current.completedHabits, habitId];
        }

        return {
          ...current,
          completedHabits,
        };
      });

      onCompletedChanged(completedHabits.length);
    } catch (error: any) {
      alert(error.message);
    }
  }

  useEffect(() => {
    return () => {
      loadHabits();
    };
  }, []);

  const isDateInPast = dayjs(date).endOf("day").isBefore(new Date());

  return (
    <div className="mt-6 flex flex-col gap-3">
      {habitsInfo?.possibleHabits.map((habit) => {
        const isChecked = habitsInfo.completedHabits.includes(habit.id);

        return (
          <CheckBox.Root
            key={habit.id}
            checked={isChecked}
            onCheckedChange={() => handleToggleHabit(habit.id)}
            disabled={isDateInPast}
            className="flex items-center gap-3 group "
          >
            <div className="h-8 w-8 rounded-lg flex items-center justify-center bg-zinc-900 border-2 border-zinc-800 transition-colors hover:border-zinc-700 group-data-[state=checked]:bg-green-500 group-data-[state=checked]:border-green-500 group-data-[state=checked]:hover:bg-green-600 group-data-[state=checked]:hover:border-green-600 group-data-[disabled]:cursor-not-allowed">
              <CheckBox.Indicator>
                <Check size={20} className="text-white" />
              </CheckBox.Indicator>
            </div>

            <span className="font-semibold text-xl text-white leading-tight group-data-[state=checked]:line-through group-data-[state=checked]:text-zinc-500">
              {habit.title}
            </span>
          </CheckBox.Root>
        );
      })}
    </div>
  );
}
