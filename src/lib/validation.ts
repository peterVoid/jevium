import z from "zod";

const stringRequired = z.string().trim().min(1);

export const updateUsernameSchema = z.object({
  username: stringRequired.max(30),
});

export type updateUsernameValues = z.infer<typeof updateUsernameSchema>;

export const updateUserInformationSchema = z.object({
  name: stringRequired.max(50),
  pronouns: z.array(z.string()).optional(),
  shortBio: stringRequired.max(160).optional(),
});

export type updateUserInformationValues = z.infer<
  typeof updateUserInformationSchema
>;
