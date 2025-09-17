export type LifespanOptions = {
  dob?: Date | string;
  expectancyYears?: number;
  fps?: number;
};

export function parseDob(dob?: Date | string): Date {
  if (!dob) return new Date(2001, 3, 9); // Default used previously
  if (dob instanceof Date) return dob;
  // Accept ISO or yyyy-mm-dd
  const d = new Date(dob);
  if (!isNaN(d.getTime())) return d;
  return new Date(2001, 3, 9);
}

export function expectedDeathDate(dob: Date, expectancyYears = 80): Date {
  // Approximate using mean tropical year length
  const ms = expectancyYears * 365.2425 * 24 * 60 * 60 * 1000;
  return new Date(dob.getTime() + ms);
}

export function estimateRemainingSeconds(dob: Date, expectancyYears = 80): number {
  const death = expectedDeathDate(dob, expectancyYears);
  const now = Date.now();
  const remainingMs = Math.max(0, death.getTime() - now);
  return remainingMs / 1000;
}

export function formatInt(n: number): string {
  // Clamp negative and format with grouping
  const v = n < 0 ? 0 : Math.floor(n);
  return v.toLocaleString(undefined, { maximumFractionDigits: 0 });
}

export function startLifespanSecondsTicker(
  el: HTMLElement,
  opts: LifespanOptions = {}
): () => void {
  const dob = parseDob(opts.dob);
  const expectancy = opts.expectancyYears ?? 80;
  const fps = Math.min(Math.max(opts.fps ?? 10, 1), 60); // 1..60

  const tick = () => {
    const secs = estimateRemainingSeconds(dob, expectancy);
    el.textContent = formatInt(secs);
  };

  // Initial paint then steady updates
  tick();
  const timer: number = setInterval(tick, 1000 / fps) as unknown as number;

  return () => {
    clearInterval(timer as unknown as number);
  };
}
