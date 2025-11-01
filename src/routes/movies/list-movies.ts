import { db } from "@/db";
import { movies } from "@/db/schema";
import { and, asc, desc, eq, gte, ilike, lte, sql } from "drizzle-orm";
import { createSelectSchema } from "drizzle-zod";
import { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { z } from "zod";

export const listMovies: FastifyPluginAsyncZod = async (app) => {
  app.get(
    "/api/movies",
    {
      schema: {
        summary: "List movies with filters, pagination and sorting",
        tags: ["Movies"],
        querystring: z.object({
          page: z.coerce.number().min(1).default(1),
          limit: z.coerce.number().min(1).max(100).default(10),

          title: z.string().optional(),
          language: z.string().optional(),
          status: z.string().optional(),

          genre: z.string().optional(),

          minRating: z.coerce.number().optional(),
          maxRating: z.coerce.number().optional(),
          minYear: z.coerce.number().optional(),
          maxYear: z.coerce.number().optional(),
          minDuration: z.coerce.number().optional(),
          maxDuration: z.coerce.number().optional(),
          ageRating: z.coerce.number().optional(),

          userId: z.string().uuid().optional(),

          orderBy: z
            .enum([
              "title",
              "releaseDate",
              "rating",
              "votes",
              "durationMinutes",
              "createdAt",
            ])
            .default("createdAt"),
          order: z.enum(["asc", "desc"]).default("desc"),
        }),
        response: {
          200: z.object({
            data: z.array(createSelectSchema(movies)),
            pagination: z.object({
              page: z.number(),
              limit: z.number(),
              total: z.number(),
              totalPages: z.number(),
            }),
          }),
          500: z.object({
            message: z.string(),
          }),
        },
      },
    },
    async (request, reply) => {
      const {
        page,
        limit,
        title,
        language,
        status,
        genre,
        minRating,
        maxRating,
        minYear,
        maxYear,
        minDuration,
        maxDuration,
        ageRating,
        userId,
        orderBy,
        order,
      } = request.query;

      try {
        const conditions = [];

        if (title) {
          conditions.push(ilike(movies.title, `%${title}%`));
        }

        if (language) {
          conditions.push(eq(movies.language, language));
        }

        if (status) {
          conditions.push(eq(movies.status, status));
        }

        if (genre) {
          conditions.push(sql`${movies.genres} @> ARRAY[${genre}]::text[]`);
        }

        if (minRating !== undefined) {
          conditions.push(gte(movies.rating, minRating.toString()));
        }

        if (maxRating !== undefined) {
          conditions.push(lte(movies.rating, maxRating.toString()));
        }

        if (minYear !== undefined) {
          conditions.push(gte(movies.releaseDate, `${minYear}-01-01`));
        }

        if (maxYear !== undefined) {
          conditions.push(lte(movies.releaseDate, `${maxYear}-12-31`));
        }

        if (minDuration !== undefined) {
          conditions.push(gte(movies.durationMinutes, minDuration));
        }

        if (maxDuration !== undefined) {
          conditions.push(lte(movies.durationMinutes, maxDuration));
        }

        if (ageRating !== undefined) {
          conditions.push(eq(movies.ageRating, ageRating));
        }

        if (userId) {
          conditions.push(eq(movies.userId, userId));
        }

        const whereClause =
          conditions.length > 0 ? and(...conditions) : undefined;

        const orderByMap = {
          title: movies.title,
          releaseDate: movies.releaseDate,
          rating: movies.rating,
          votes: movies.votes,
          durationMinutes: movies.durationMinutes,
          createdAt: movies.createdAt,
        };

        const orderByColumn = orderByMap[orderBy];
        const orderClause =
          order === "asc" ? asc(orderByColumn) : desc(orderByColumn);

        const offset = (page - 1) * limit;

        const data = await db
          .select()
          .from(movies)
          .where(whereClause)
          .orderBy(orderClause)
          .limit(limit)
          .offset(offset);

        const [{ count }] = await db
          .select({ count: sql<number>`count(*)::int` })
          .from(movies)
          .where(whereClause);

        const totalPages = Math.ceil(count / limit);

        return reply.status(200).send({
          data,
          pagination: {
            page,
            limit,
            total: count,
            totalPages,
          },
        });
      } catch (err) {
        console.error(err);
        return reply.status(500).send({ message: "Erro ao listar filmes." });
      }
    }
  );
};
