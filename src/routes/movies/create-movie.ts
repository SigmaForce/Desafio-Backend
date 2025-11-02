import { db } from "@/db";
import { movies } from "@/db/schema/movies";
import { uploadFileToS3 } from "@/utils/storage";
import { createSelectSchema } from "drizzle-zod";
import { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { z } from "zod";

export const createMovie: FastifyPluginAsyncZod = async (app) => {
  app.post(
    "/api/movie",
    {
      onRequest: [app.authenticate],
      schema: {
        summary: "Create Movie with file uploads",
        tags: ["Movies"],
        consumes: ["multipart/form-data"],
        response: {
          201: createSelectSchema(movies),
          400: z.object({
            message: z.string(),
          }),
        },
      },
    },
    async (request, reply) => {
      const userId = request.user!.id;

      try {
        if (!request.isMultipart()) {
          return reply.status(400).send({
            message: "Request deve ser multipart/form-data",
          });
        }

        const parts = request.parts();
        const fields: Record<string, any> = {};
        const files: Record<string, any> = {};

        for await (const part of parts) {
          if (part.type === "file") {
            const buffer = await part.toBuffer();
            files[part.fieldname] = {
              filename: part.filename,
              mimetype: part.mimetype,
              buffer: buffer,
            };
          } else {
            fields[part.fieldname] = part.value;
          }
        }

        const requiredFields = [
          "title",
          "originalTitle",
          "synopsis",
          "language",
          "releaseDate",
          "durationMinutes",
          "status",
        ];

        for (const field of requiredFields) {
          if (!fields[field]) {
            return reply.status(400).send({
              message: `Campo obrigatório ausente: ${field}`,
            });
          }
        }

        if (!files.poster || !files.backdrop || !files.trailer) {
          return reply.status(400).send({
            message: "É necessário enviar poster, backdrop e trailer",
          });
        }

        const allowedImageTypes = [
          "image/jpeg",
          "image/png",
          "image/webp",
          "image/gif",
        ];
        const allowedVideoTypes = [
          "video/mp4",
          "video/quicktime",
          "video/x-msvideo",
        ];

        if (!allowedImageTypes.includes(files.poster.mimetype)) {
          return reply.status(400).send({
            message: "Poster deve ser uma imagem (JPEG, PNG, WEBP ou GIF)",
          });
        }

        if (!allowedImageTypes.includes(files.backdrop.mimetype)) {
          return reply.status(400).send({
            message: "Backdrop deve ser uma imagem (JPEG, PNG, WEBP ou GIF)",
          });
        }

        if (!allowedVideoTypes.includes(files.trailer.mimetype)) {
          return reply.status(400).send({
            message: "Trailer deve ser um vídeo (MP4, MOV ou AVI)",
          });
        }

        const [posterResult, backdropResult, trailerResult] = await Promise.all(
          [
            uploadFileToS3(files.poster, "posters"),
            uploadFileToS3(files.backdrop, "backdrops"),
            uploadFileToS3(files.trailer, "trailers"),
          ]
        );

        let genres = fields.genres;
        if (typeof genres === "string") {
          try {
            genres = JSON.parse(genres);
          } catch {
            genres = [genres];
          }
        }

        const [newMovie] = await db
          .insert(movies)
          .values({
            title: fields.title,
            originalTitle: fields.originalTitle,
            tagline: fields.tagline || null,
            synopsis: fields.synopsis,
            language: fields.language,
            releaseDate: fields.releaseDate,
            durationMinutes: Number(fields.durationMinutes),
            status: fields.status,
            budget: fields.budget ? fields.budget.toString() : null,
            revenue: fields.revenue ? fields.revenue.toString() : null,
            profit: fields.profit ? fields.profit.toString() : null,
            votes: fields.votes ? Number(fields.votes) : 0,
            rating: fields.rating ? fields.rating.toString() : null,
            ageRating: fields.ageRating ? Number(fields.ageRating) : 0,
            posterUrl: posterResult.url,
            backdropUrl: backdropResult.url,
            trailerUrl: trailerResult.url,
            genres: genres,
            userId: userId,
          })
          .returning();

        return reply.status(201).send(newMovie);
      } catch (err) {
        console.error(err);
        return reply.status(400).send({
          message: "Erro ao criar filme: " + (err as Error).message,
        });
      }
    }
  );
};
