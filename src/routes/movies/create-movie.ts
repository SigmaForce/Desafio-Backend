import { db } from "@/db";
import { movies } from "@/db/schema/movies";
import { createSelectSchema } from "drizzle-zod";
import { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { z } from "zod";

export const createMovie: FastifyPluginAsyncZod = async (app) => {
  app.post(
    "/api/movie",
    {
      onRequest: [app.authenticate],
      schema: {
        summary: "Create Movie",
        tags: ["Movies"],
        body: z.object({
          title: z.string(),
          originalTitle: z.string(),
          tagline: z.string(),
          synopsis: z.string(),
          language: z.string(),
          releaseDate: z.string(),
          durationMinutes: z.number(),
          status: z.string(),
          budget: z.number().optional(),
          revenue: z.number().optional(),
          profit: z.number().optional(),
          votes: z.number().optional(),
          rating: z.number().optional(),
          ageRating: z.number().optional(),
          posterUrl: z.string(),
          backdropUrl: z.string(),
          trailerUrl: z.string(),
          genres: z.array(z.string()),
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
      const movieData = request.body;
      const userId = request.user!.id;
      try {
        const [newMovie] = await db
          .insert(movies)
          .values({
            title: movieData.title,
            originalTitle: movieData.originalTitle,
            tagline: movieData.tagline,
            synopsis: movieData.synopsis,
            language: movieData.language,
            releaseDate: movieData.releaseDate,
            durationMinutes: movieData.durationMinutes,
            status: movieData.status,
            budget: movieData.budget ? movieData.budget.toString() : null,
            revenue: movieData.revenue ? movieData.revenue.toString() : null,
            profit: movieData.profit ? movieData.profit.toString() : null,
            votes: movieData.votes ?? 0,
            rating: movieData.rating ? movieData.rating.toString() : null,
            ageRating: movieData.ageRating ?? 0,
            posterUrl: movieData.posterUrl,
            backdropUrl: movieData.backdropUrl,
            trailerUrl: movieData.trailerUrl,
            genres: movieData.genres,
            userId: userId,
          })
          .returning();

        return reply.status(200).send(newMovie);
      } catch (err) {
        console.error(err);
        return reply.status(400).send({ message: "Erro ao criar filme." });
      }
    }
  );
};
