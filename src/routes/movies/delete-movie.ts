import { db } from "@/db";
import { movies } from "@/db/schema";

import { eq } from "drizzle-orm";
import { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { z } from "zod";

export const deleteMovie: FastifyPluginAsyncZod = async (app) => {
  app.delete(
    "/api/movie/:id",
    {
      schema: {
        summary: "Delete a specific movie by ID",
        tags: ["Movies"],
        params: z.object({
          id: z.uuid(),
        }),
        response: {
          204: z.void(),
          404: z.object({
            message: z.string(),
          }),
        },
      },
    },
    async (request, reply) => {
      const { id } = request.params;

      const result = await db
        .delete(movies)
        .where(eq(movies.id, id))
        .returning();

      if (result.length === 0) {
        return reply.status(404).send({ message: "Movie not found" });
      }

      return reply.status(204).send();
    }
  );
};
