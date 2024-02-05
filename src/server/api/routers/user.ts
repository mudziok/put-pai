import { TRPCError } from "@trpc/server";
import { createHash, randomBytes } from "crypto";
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

const hash = (text: string, salt: string) =>
  createHash("md5")
    .update(text + salt)
    .digest("hex");

export const userRouter = createTRPCRouter({
  register: publicProcedure
    .input(z.object({ email: z.string().email(), password: z.string().min(8) }))
    .mutation(async ({ input, ctx }) => {
      const { email, password } = input;

      const salt = randomBytes(16).toString("hex");
      const hashedPassword = hash(password, salt);

      try {
        const user = await ctx.prisma.user.create({
          data: { email, salt, password: hashedPassword },
        });
        return user;
      } catch (e) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "This email is already registered.",
          cause: e,
        });
      }
    }),
  login: publicProcedure
    .input(z.object({ email: z.string(), password: z.string() }))
    .query(async ({ input, ctx }) => {
      const { email, password } = input;

      const user = await ctx.prisma.user.findUnique({ where: { email } });
      if (!user) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "This email is not registered.",
        });
      }

      const hashedPassword = hash(password, user.salt);
      if (hashedPassword !== user.password) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Incorrect password.",
        });
      }

      return user;
    }),
  generateRecovery: publicProcedure
    .input(z.object({ email: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const { email } = input;

      const user = await ctx.prisma.user.findUnique({ where: { email } });
      if (!user) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "This email is not registered.",
        });
      }

      const recovery = await ctx.prisma.recovery.create({
        data: { userId: user.id },
      });

      return recovery;
    }),
  changePassword: publicProcedure
    .input(z.object({ id: z.string(), password: z.string().min(8) }))
    .mutation(async ({ input, ctx }) => {
      const { id, password } = input;

      const recovery = await ctx.prisma.recovery.findUnique({ where: { id } });
      if (!recovery) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "This recovery id is not valid.",
        });
      }

      const salt = randomBytes(16).toString("hex");
      const hashedPassword = hash(password, salt);

      const user = await ctx.prisma.user.update({
        where: { id: recovery.userId },
        data: { password: hashedPassword, salt },
      });

      return user;
    }),
});
