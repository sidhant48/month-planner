import { parseISO, startOfDay, isBefore, isAfter } from "date-fns";

export const toDayStart = (iso: string | Date) =>
  typeof iso === "string" ? startOfDay(parseISO(iso)) : startOfDay(iso);

export const dayIsBetween = (day: Date, startIso: string, endIso: string) => {
  const s = toDayStart(startIso);
  const e = toDayStart(endIso);
  const d = startOfDay(day);
  if (isBefore(d, s)) return false;
  if (isAfter(d, e)) return false;
  return true;
};

export const isoDay = (d: Date) => {
  const local = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  return local.toISOString();
};
