import * as z from "zod";

export const loginSchema = z.object({
   name: z.string().min(1, "Это обязательное поле"),
});

export type LoginFormType = z.infer<typeof loginSchema>;
