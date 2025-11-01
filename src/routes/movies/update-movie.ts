import { db } from "@/db";
import { movies } from "@/db/schema";
import { eq } from "drizzle-orm";
import { createSelectSchema } from "drizzle-zod";
import { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { z } from "zod";

export const updateMovie: FastifyPluginAsyncZod = async (app) => {
  app.put(
    "/api/movie/:id",
    {
      onRequest: [app.authenticate],
      schema: {
        summary: "Update a specific movie by ID",
        tags: ["Movies"],
        params: z.object({
          id: z.string().uuid(),
        }),
        body: z.object({
          title: z.string().optional(),
          originalTitle: z.string().optional(),
          tagline: z.string().optional(),
          synopsis: z.string().optional(),
          language: z.string().optional(),
          releaseDate: z.string().optional(),
          durationMinutes: z.number().optional(),
          status: z.string().optional(),
          budget: z.number().optional(),
          revenue: z.number().optional(),
          profit: z.number().optional(),
          votes: z.number().optional(),
          rating: z.number().optional(),
          ageRating: z.number().optional(),
          posterUrl: z.string().optional(),
          backdropUrl: z.string().optional(),
          trailerUrl: z.string().optional(),
          genres: z.array(z.string()).optional(),
        }),
        response: {
          200: createSelectSchema(movies),
          403: z.object({
            message: z.string(),
          }),
          404: z.object({
            message: z.string(),
          }),
          400: z.object({
            message: z.string(),
          }),
        },
      },
    },
    async (request, reply) => {
      const { id } = request.params;
      const movieData = request.body;
      const userId = request.user!.id;
      try {
        const [existingMovie] = await db
          .select()
          .from(movies)
          .where(eq(movies.id, id))
          .limit(1);

        if (!existingMovie) {
          return reply.status(404).send({ message: "Movie not found" });
        }

        if (existingMovie.userId !== userId) {
          return reply.status(403).send({
            message: "Você não tem permissão para atualizar este filme",
          });
        }

        const convertedData: any = { ...movieData };

        if (convertedData.budget !== undefined) {
          convertedData.budget = convertedData.budget.toString();
        }
        if (convertedData.revenue !== undefined) {
          convertedData.revenue = convertedData.revenue.toString();
        }
        if (convertedData.profit !== undefined) {
          convertedData.profit = convertedData.profit.toString();
        }
        if (convertedData.rating !== undefined) {
          convertedData.rating = convertedData.rating.toString();
        }

        const updatedData = {
          ...existingMovie,
          ...convertedData,
          updatedAt: new Date(),
        };

        const [updatedMovie] = await db
          .update(movies)
          .set(updatedData)
          .where(eq(movies.id, id))
          .returning();

        return reply.status(200).send(updatedMovie);
      } catch (err) {
        console.error(err);
        return reply.status(400).send({ message: "Erro ao atualizar filme." });
      }
    }
  );
};
