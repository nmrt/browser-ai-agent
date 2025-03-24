import { z } from 'zod';

export const BrowserActionSchema = z.object({
  action: z.enum(['click', 'type', 'scroll', 'wait']),
  selector: z.string().optional(),
  text: z.string().optional(),
  position: z.object({
    x: z.number(),
    y: z.number()
  }).optional(),
});

export type BrowserAction = z.infer<typeof BrowserActionSchema>;

export interface BrowserAutomation {
  executeAction: (action: BrowserAction) => Promise<void>;
}