import { z } from "zod";

export const CreateLinkSchema = z.object({
  url: z
    .url({
      message: "Please enter a valid URL. Include http:// or https://",
    })
    .min(1, { message: "URL is required." })
    .regex(/^(?!https?:\/\/(www\.)?nexurl\.vercel\.app).*$/, {
      message: "You cannot redirect to the nexurl.",
    })
    .regex(/^\S+$/, {
      message: "URL must not contain any blank spaces.",
    }),
  customAlias: z
    .string()
    .optional()
    .refine(
      (val) => !val || val.length >= 1,
      { message: "Short link must be at least 1 characters long." }
    )
    .refine(
      (val) => !val || /^[a-zA-Z0-9_-]*$/.test(val),
      {
        message:
          "Custom short link must not contain spaces or special characters.",
      }
    )
    .refine((val) => !val || !/&c$/.test(val), {
      message: "Custom short link can't end with &c.",
    }),
});
