import { z } from "zod";
export const MODEL_VERSION = "echo-sim-0.2.0";
export const InputSchema = z.object({
  vehicles: z.number().min(0).max(60000), tree: z.number().min(0).max(100),
  rain: z.number().min(0).max(150), drain: z.number().min(1).max(150),
  imp: z.number().min(0).max(100), horizon: z.number().min(1).max(30),
  greenroof: z.boolean(), permeable: z.boolean(), ev: z.boolean(),
});
export type Inputs = z.infer<typeof InputSchema>;
const cl = (x: number, a = 0, b = 1) => Math.min(b, Math.max(a, x));
/** Deterministic; all outputs are relative, illustrative indicators (see About page). */
export function simulate(i: Inputs) {
  const tr = cl(i.vehicles / 60000) * (i.ev ? 0.7 : 1);
  const et = Math.min(i.tree * (0.6 + 0.4 * Math.min(i.horizon / 10, 1)), 100 - i.imp) / 100;
  const im = i.imp / 100;
  const air = 100 * cl(0.85 * tr * (1 - 0.3 * et) + 0.15 * im);
  let heat = 100 * cl(0.5 * im + 0.25 * tr + 0.25 * (1 - et)); if (i.greenroof) heat *= 0.94;
  let runoff = i.rain * (0.1 + 0.8 * im) * (1 - 0.3 * et); if (i.permeable) runoff *= 0.8;
  const r = runoff / i.drain;
  return { air, heat, runoff, flood: (100 * r) / (1 + r), green: cl(et * 100 + (i.greenroof ? 5 : 0), 0, 100) };
}
export const BASELINE: Inputs = { vehicles: 20000, tree: 18, rain: 30, drain: 40, imp: 55, horizon: 5, greenroof: false, permeable: false, ev: false };
