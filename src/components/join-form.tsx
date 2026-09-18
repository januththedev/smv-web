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

const inputClass =
  "h-14 min-w-0 w-full rounded-xs border border-line bg-raised px-4 text-base text-fg placeholder:text-muted shadow-border outline-none transition-none focus-visible:outline-2 focus-visible:outline-fg focus-visible:outline-offset-2";

export function JoinForm({ compact }: Props) {
  const formRef = useRef<HTMLFormElement>(null);
  const [sent, setSent] = useState(false);
  const [payload, setPayload] = useState<{
    name: string;
    phone: string;
    goal: (typeof goals)[number];
    note: string;
  }>({ name: "", phone: "", goal: goals[0], note: "" });

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
      phone: nextPhone,
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
    const message = `Hi SMV GYM — I'm ${payload.name}. Goal: ${payload.goal}. My number: ${payload.phone}.${payload.note ? ` ${payload.note}` : ""}`.trim();
    return (
      <div className="rounded-xs border-t border-line bg-surface p-6 md:p-8" role="status" aria-live="polite">
        <p className="font-display text-4xl font-semibold uppercase leading-[0.9] tracking-tight text-fg">
          Your message is ready.
        </p>
        <p className="mt-3 text-muted">
          Open WhatsApp and send it to the gym. Nothing has been sent yet.
          The gym receives your details only after you send the message in WhatsApp.
        </p>
        <div className="mt-6 flex flex-col flex-wrap gap-3 sm:flex-row">
          <Button asChild className="rounded-xs transition-none active:not-disabled:scale-100">
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
      className="flex flex-col gap-5"
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <Label htmlFor="join-name">Name</Label>
          <Input
            id="join-name"
            name="name"
            required
            autoComplete="name"
            className={inputClass}
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
            className={inputClass}
          />
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="join-goal">Goal</Label>
        <select
          id="join-goal"
          name="goal"
          defaultValue={goals[0]}
          className={inputClass}
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
            className="min-h-32 rounded-xs border border-line bg-raised px-4 py-3 text-base text-fg placeholder:text-muted shadow-border outline-none transition-none focus-visible:outline-2 focus-visible:outline-fg focus-visible:outline-offset-2"
          />
        </div>
      )}
      <Button type="submit" size="lg" className="mt-1 h-14 w-full self-start rounded-xs px-4 transition-none active:not-disabled:scale-100 sm:w-auto">
        Prepare WhatsApp message
      </Button>
      <p className="max-w-prose text-xs leading-relaxed text-muted">
        This form prepares a WhatsApp message for you to review and send; it
        does not send anything to the gym. A copy is saved in this browser when
        storage is available. Ask the gym for the current membership price.
      </p>
    </form>
  );
}
