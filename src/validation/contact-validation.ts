import { z, ZodType } from "zod";

export class ContactValidation {
  static readonly CREATE: ZodType = z.object({
    first_name: z.string().min(1).max(100),
    last_name: z.string().min(1).max(100).optional(),
    email: z.string().min(1).max(100).email().optional(),
    phone: z.string().min(10).max(20).optional(),
  });

  static readonly GET: ZodType = z.number().positive();

  static readonly UPDATE: ZodType = z.object({
    id: z.number().positive(),
    first_name: z.string().min(1).max(100).optional(),
    last_name: z.string().min(1).max(100).optional(),
    email: z.string().min(1).max(100).email().optional(),
    phone: z.string().min(10).max(20).optional(),
  });

  static readonly DELETE: ZodType = z.number().positive();

  static readonly SEARCH: ZodType = z.object({
    name: z.string().min(1).max(100).optional(),
    phone: z.string().min(10).max(20).optional(),
    email: z.string().min(1).max(100).email().optional(),
    page: z.number().positive().optional(),
    size: z.number().positive().optional(),
  });
}
