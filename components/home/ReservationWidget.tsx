"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { DayPicker } from "react-day-picker";
import "react-day-picker/style.css";
import { format, isBefore, parseISO, startOfDay } from "date-fns";
import { createSupabaseClient } from "../../lib/supabase/supabaseClient";
import type { ClassSchedule, WellnessClass } from "../../lib/types";

interface ReservationWidgetProps {
  classes: WellnessClass[];
  schedules: ClassSchedule[];
}

export default function ReservationWidget({
  classes,
  schedules
}: ReservationWidgetProps) {
  const router = useRouter();
  const supabase = createSupabaseClient();

  const [selectedClassId, setSelectedClassId] = useState(classes[0]?.id ?? "");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedScheduleId, setSelectedScheduleId] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  const classSchedules = useMemo(
    () => schedules.filter((s) => s.class_id === selectedClassId),
    [schedules, selectedClassId]
  );

  const enabledDateSet = useMemo(() => {
    const set = new Set<string>();
    classSchedules.forEach((s) => {
      const d = parseISO(s.date);
      if (s.available_slots > 0 && d.getDay() !== 0) set.add(s.date);
    });
    return set;
  }, [classSchedules]);

  const daySchedules = useMemo(() => {
    if (!selectedDate) return [];
    const key = format(selectedDate, "yyyy-MM-dd");
    return classSchedules.filter((s) => s.date === key);
  }, [classSchedules, selectedDate]);

  const selectedSchedule = classSchedules.find((s) => s.id === selectedScheduleId);

  async function reserveSlot() {
    if (!selectedScheduleId) return;

    setLoading(true);
    setMsg("");

    const {
      data: { user }
    } = await supabase.auth.getUser();

    if (!user) {
      setLoading(false);
      router.push("/login?next=/");
      return;
    }

    const { error } = await supabase.rpc("reserve_class_slot", {
      p_schedule_id: selectedScheduleId
    });

    if (error) {
      setMsg(error.message);
      setLoading(false);
      return;
    }

    setMsg("Reserva confirmada. ¡Nos vemos en Shamkalpa!");
    setSelectedScheduleId("");
    setLoading(false);
    router.refresh();
  }

  if (!classes.length) {
    return (
      <div className="surface p-6">
        <p className="text-textGlow/80">Aún no hay prácticas disponibles.</p>
      </div>
    );
  }

  return (
    <div className="surface soft-glow p-6">
      <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
        <div>
          <label className="mb-2 block text-sm text-textGlow/90">
            Selecciona una práctica
          </label>

          <select
            value={selectedClassId}
            onChange={(e) => {
              setSelectedClassId(e.target.value);
              setSelectedDate(undefined);
              setSelectedScheduleId("");
              setMsg("");
            }}
          >
            {classes.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>

          <p className="mt-3 text-sm text-textGlow/70">
            Solo se muestran días con cupos. Domingos deshabilitados.
          </p>
        </div>

        <div className="space-y-4">
          <DayPicker
            mode="single"
            selected={selectedDate}
            onSelect={(date) => {
              setSelectedDate(date);
              setSelectedScheduleId("");
            }}
            disabled={(date) => {
              const key = format(date, "yyyy-MM-dd");
              const isPast = isBefore(startOfDay(date), startOfDay(new Date()));
              return date.getDay() === 0 || isPast || !enabledDateSet.has(key);
            }}
            className="rounded-xl border border-violetAura/30 bg-night/70 p-3"
          />

          <div className="space-y-2">
            {selectedDate && daySchedules.length === 0 && (
              <p className="text-sm text-red-300">No hay horarios para ese día.</p>
            )}

            {daySchedules.map((s) => (
              <button
                key={s.id}
                type="button"
                disabled={s.available_slots <= 0}
                onClick={() => setSelectedScheduleId(s.id)}
                className={`w-full rounded-xl border p-3 text-left transition ${
                  selectedScheduleId === s.id
                    ? "border-violetAura bg-violetAura/20"
                    : "border-violetAura/30 bg-night/70 hover:bg-violetAura/10"
                } ${s.available_slots <= 0 ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                <div className="flex items-center justify-between text-sm">
                  <span>
                    {s.start_time.slice(0, 5)} - {s.end_time.slice(0, 5)}
                  </span>

                  {s.available_slots === 0 ? (
                    <span className="text-red-300">Clase llena</span>
                  ) : s.available_slots <= 3 ? (
                    <span className="text-amber-300">
                      ¡Solo {s.available_slots} cupos disponibles!
                    </span>
                  ) : (
                    <span className="text-mintAura">{s.available_slots} cupos</span>
                  )}
                </div>
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={reserveSlot}
            disabled={!selectedSchedule || selectedSchedule.available_slots <= 0 || loading}
            className="btn-primary w-full disabled:opacity-50"
          >
            {loading ? "Reservando..." : "Reservar mi cupo"}
          </button>

          {msg && <p className="text-sm text-textGlow/90">{msg}</p>}
        </div>
      </div>
    </div>
  );
}
