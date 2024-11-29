import { z, ZodType } from "zod";

export class userValidation {
    static readonly REGISTER : ZodType = z.object({
        username: z.string().min(3).max(20),
        password: z.string().min(8).max(20),
        name: z.string().min(3).max(50)
    })
}