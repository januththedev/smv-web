import { useRef, useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { goals, site, waJoin } from "@/lib/site";

const STORAGE_KEY = "smv-join-inquiries";

type Props = {
  compact?: boolean;
};

export function JoinForm({ compact }: Props) {
  const formRef = useRef<HTMLFormElement>(null);
  const [sent, setSent] = useState(false);
  const [payload, setPayload] = useState<{
    name: string;
    goal: (typeof goals)[number];
    note: string;
  }>({ name: "", goal: goals[0], note: "" });

  function capture(form: HTMLFormElement) {
    const fd = new FormData(form);
    const nextName = String(fd.get("name") ?? "").trim();
    const nextPhone = String(fd.get("phone") ?? "").trim();
    const nextGoal = String(fd.get("goal") ?? goals[0]);
    const nextNote = String(fd.get("note") ?? "").trim();
    if (!nextName || !nextPhone) return false;
    const entry = {
      name: nextName,
      phone: nextPhone,
      goal: nextGoal,
      note: nextNote,
      at: new Date().toISOString(),
    };
    try {
      const prev = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]") as unknown[];
      localStorage.setItem(STORAGE_KEY, JSON.stringify([entry, ...prev].slice(0, 20)));
    } catch {
      /* ignore quota */
    }
    setPayload({
      name: nextName,
      goal: ((goals as readonly string[]).includes(nextGoal)
        ? nextGoal
        : goals[0]) as (typeof goals)[number],
      note: nextNote,
    });
    setSent(true);
    return true;
  }

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    e.stopPropagation();
    capture(e.currentTarget);
  }

  if (sent) {
    const message = `Hi SMV GYM — I'm ${payload.name}. Goal: ${payload.goal}. ${payload.note}`.trim();
    return (
      <div className="rounded-xl bg-raised p-6 shadow-[0_0_0_1px_rgb(238_234_227_/_10%)]">
        <p className="font-display text-3xl font-semibold uppercase tracking-tight text-fg">
          We have your note.
        </p>
        <p className="mt-3 text-muted">
          Finish it on WhatsApp so Saranga or the floor can answer you today.
        </p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Button asChild>
            <a href={waJoin(message)}>Open WhatsApp</a>
          </Button>
          <Button asChild variant="ghost">
            <a href={`tel:${site.phoneTel}`}>Call {site.phone}</a>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <form
      ref={formRef}
      onSubmit={onSubmit}
      method="dialog"
      className="flex flex-col gap-4"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <Label htmlFor="join-name">Name</Label>
          <Input
            id="join-name"
            name="name"
            required
            autoComplete="name"
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="join-phone">Phone</Label>
          <Input
            id="join-phone"
            name="phone"
            required
            type="tel"
            autoComplete="tel"
          />
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="join-goal">Goal</Label>
        <select
          id="join-goal"
          name="goal"
          defaultValue={goals[0]}
          className="h-12 rounded-md bg-raised px-3 text-base text-fg shadow-[0_0_0_1px_rgb(238_234_227_/_12%)] outline-none focus-visible:shadow-[0_0_0_1px_var(--color-iron)]"
        >
          {goals.map((g) => (
            <option key={g} value={g}>
              {g}
            </option>
          ))}
        </select>
      </div>
      {!compact && (
        <div className="flex flex-col gap-2">
          <Label htmlFor="join-note">Anything we should know</Label>
          <Textarea
            id="join-note"
            name="note"
            placeholder="Training history, preferred time, competition plans…"
          />
        </div>
      )}
      <Button type="submit" size="lg" className="mt-2 self-start pr-5">
        Send to the floor
      </Button>
      <p className="text-xs text-subtle">
        We do not invent prices on a website. Membership is quoted on the floor or on WhatsApp.
      </p>
    </form>
  );
}
