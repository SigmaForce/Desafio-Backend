import { db } from "@/db";
import { movies } from "@/db/schema";

import { eq } from "drizzle-orm";
import { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { z } from "zod";

export const deleteMovie: FastifyPluginAsyncZod = async (app) => {
  app.delete(
    "/api/movie/:id",
    {
      onRequest: [app.authenticate],
      schema: {
        summary: "Delete a specific movie by ID",
        tags: ["Movies"],
        params: z.object({
          id: z.string().uuid(),
        }),
        response: {
          204: z.void(),
          403: z.object({
            message: z.string(),
          }),
          404: z.object({
            message: z.string(),
          }),
        },
      },
    },
    async (request, reply) => {
      const { id } = request.params;
      const userId = request.user!.id;

      const [movie] = await db
        .select()
        .from(movies)
        .where(eq(movies.id, id))
        .limit(1);

      if (!movie) {
        return reply.status(404).send({ message: "Filme não encontrado" });
      }

      if (movie.userId !== userId) {
        return reply.status(403).send({
          message: "Você não tem permissão para deletar este filme",
        });
      }

      await db.delete(movies).where(eq(movies.id, id));

      return reply.status(204).send();
    }
  );
};
