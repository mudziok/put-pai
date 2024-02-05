import { TRPCError } from "@trpc/server";
import { z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

const removeDoubles = (arr: string[]) => {
  return [...new Set(arr)];
};

const getTags = (content: string) => {
  const regex = /#(\w+)/g;
  const matches = content.match(regex);
  if (!matches) {
    return [];
  }
  return matches.map((match) => match.replace("#", "#"));
};

export const notesRouter = createTRPCRouter({
  all: protectedProcedure
    .input(z.object({ search: z.string().optional() }))
    .query(async ({ ctx, input }) => {
      const { session } = ctx;
      const { search } = input;
      const userId = session.user.id;

      const notes = await ctx.prisma.note.findMany({
        where: {
          userId,
          OR: [
            { content: { contains: search } },
            { title: { contains: search } },
          ],
        },
      });

      const taggedNotes = notes.map((note) => ({
        ...note,
        tags: getTags(note.content),
      }));

      const allTags = taggedNotes.reduce((acc, note) => {
        return [...acc, ...note.tags];
      }, [] as string[]);

      const uniqueTags = removeDoubles(allTags);

      return { notes: taggedNotes, tags: uniqueTags };
    }),
  create: protectedProcedure
    .input(z.object({ title: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      const { title } = input;
      const { session } = ctx;
      const userId = session.user.id;

      try {
        const note = await ctx.prisma.note.create({
          data: { title, userId, content: "" },
        });
        return note;
      } catch (e) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "This note title is already taken",
          cause: e,
        });
      }
    }),
  availableName: protectedProcedure
    .input(z.object({ title: z.string() }))
    .query(async ({ ctx, input }) => {
      const { title } = input;
      const { session } = ctx;
      const userId = session.user.id;

      const note = await ctx.prisma.note.findFirst({
        where: { title, userId },
      });

      return !note;
    }),
  byId: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const note = await ctx.prisma.note.findFirst({
        where: { id: input.id },
        include: { user: true },
      });
      return note;
    }),
  save: protectedProcedure
    .input(z.object({ id: z.string(), content: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { id, content } = input;
      const { session } = ctx;
      const userId = session.user.id;

      const note = await ctx.prisma.note.findFirst({
        where: { id },
      });

      if (!note) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Note with this id does not exist.",
        });
      }

      if (note.userId !== userId) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You do not have permission to edit this note.",
        });
      }

      const updatedNote = await ctx.prisma.note.update({
        where: { id },
        data: { content },
      });

      return updatedNote;
    }),
  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { id } = input;

      const note = await ctx.prisma.note.delete({
        where: { id },
      });

      return note;
    }),
  rename: protectedProcedure
    .input(z.object({ id: z.string(), title: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { id, title } = input;

      const note = await ctx.prisma.note.update({
        where: { id },
        data: { title },
      });

      return note;
    }),
});
