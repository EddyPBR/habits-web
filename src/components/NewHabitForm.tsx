import { Check } from "phosphor-react";
import * as CheckBox from "@radix-ui/react-checkbox";
import { FormEvent, useState } from "react";
import { createHabit } from "../api/createHabit";

const availableWeekDays = [
  "Domingo",
  "Segunda-feira",
  "Terça-feira",
  "Quarta-feira",
  "Quinta-feira",
  "Sexta-feira",
  "Sábado",
];

export function NewHabitForm() {
  const [title, setTitle] = useState("");
  const [weekDays, setWeekDays] = useState<number[]>([]);

  async function createNewHabit(event: FormEvent) {
    event.preventDefault();

    try {
      if (!title) {
        throw new Error("O campo título é obrigatório!");
      }

      if (weekDays.length === 0) {
        throw new Error("Escolha ao menos um dia da semana!");
      }

      await createHabit({
        title,
        weekDays,
      });

      alert("Hábito foi criado");

      setTitle("");
      setWeekDays([]);
    } catch (error: any) {
      alert(error.message);
    }
  }

  function handleToggleWeekDay(weekDay: number) {
    const weekDayAlreadyChecked = weekDays.includes(weekDay);

    if (weekDayAlreadyChecked) {
      const weekDaysWithRemoveOne = weekDays.filter((day) => day !== weekDay);
      setWeekDays(weekDaysWithRemoveOne);
    } else {
      const weekDaysWithAddedOne = [...weekDays, weekDay];
      setWeekDays(weekDaysWithAddedOne);
    }
  }

  return (
    <form onSubmit={createNewHabit} className="w-full flex flex-col mt-6">
      <label htmlFor="title" className="font-semibold leading-tight">
        Qual seu comprometimento
      </label>

      <input
        id="title"
        value={title}
        onChange={(event) => setTitle(event.target.value)}
        type="text"
        placeholder="ex.: Exercícios, dormir bem, etc..."
        autoFocus
        className="p-4 rounded-lg mt-3 bg-zinc-800 text-white placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-violet-600 focus:ring-offset-2 focus:ring-offset-zinc-900"
      />

      <label htmlFor="" className="font-semibold leading-tight mt-4">
        Qual a recorrência?
      </label>

      <div className="flex flex-col gap-2 mt-3">
        {availableWeekDays.map((weekDay, index) => {
          const isChecked = weekDays.includes(index);

          return (
            <CheckBox.Root
              key={weekDay}
              checked={isChecked}
              onCheckedChange={() => handleToggleWeekDay(index)}
              className="flex items-center gap-3 group focus:outline-none"
            >
              <div className="h-8 w-8 rounded-lg flex items-center justify-center bg-zinc-900 border-2 border-zinc-800 hover:border-zinc-700 group-data-[state=checked]:bg-green-500 group-data-[state=checked]:border-green-500 group-data-[state=checked]:hover:bg-green-600 group-data-[state=checked]:hover:border-green-600 transition-colors group-focus:ring-2 group-focus:ring-violet-600 group-focus:ring-offset-2 group-focus:ring-offset-zinc-900">
                <CheckBox.Indicator>
                  <Check size={20} className="text-white" />
                </CheckBox.Indicator>
              </div>

              <span className="text-white leading-tight">{weekDay}</span>
            </CheckBox.Root>
          );
        })}
      </div>

      <button
        type="submit"
        className="mt-6 rounded-lg p-4 flex items-center justify-center gap-3 font-semibold bg-green-600 hover:bg-green-500 group-data-[state=checked]:bg-green-500 group-data-[state=checked]:border-green-500 group-data-[state=checked]:hover:bg-green-600 group-data-[state=checked]:hover:border-green-600 transition-colors focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2 focus:ring-offset-background"
      >
        <Check size={20} weight="bold" />
        Confirmar
      </button>
    </form>
  );
}
