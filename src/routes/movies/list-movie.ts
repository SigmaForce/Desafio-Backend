import { db } from "@/db";
import { movies } from "@/db/schema";
import { eq } from "drizzle-orm";
import { createSelectSchema } from "drizzle-zod";
import { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { z } from "zod";

export const listMovie: FastifyPluginAsyncZod = async (app) => {
  app.get(
    "/api/movie/:id",
    {
      schema: {
        summary: "List movies by a specific ID",
        tags: ["Movies"],
        params: z.object({
          id: z.uuid(),
        }),
        response: {
          200: createSelectSchema(movies),
          400: z.object({
            message: z.string(),
          }),
        },
      },
    },
    async (request, reply) => {
      const { id } = request.params;

      try {
        const data = await db
          .select()
          .from(movies)
          .where(eq(movies.id, id))
          .limit(1);

        return reply.status(200).send(data[0]);
      } catch (err) {
        console.error(err);
        return reply.status(400).send({ message: "Filme não encontrado." });
      }
    }
  );
};
