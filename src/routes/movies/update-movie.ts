import { db } from "@/db";
import { movies } from "@/db/schema";
import { uploadFileToS3 } from "@/utils/storage";
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
        summary: "Update a specific movie by ID with optional file uploads",
        tags: ["Movies"],
        consumes: ["multipart/form-data"],
        params: z.object({
          id: z.uuid(),
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

        const allowedImageTypes = [
          "image/jpeg",
          "image/png",
          "image/webp",
          "image/gif",
        ];

        if (
          files.poster &&
          !allowedImageTypes.includes(files.poster.mimetype)
        ) {
          return reply.status(400).send({
            message: "Poster deve ser uma imagem (JPEG, PNG, WEBP ou GIF)",
          });
        }

        if (
          files.backdrop &&
          !allowedImageTypes.includes(files.backdrop.mimetype)
        ) {
          return reply.status(400).send({
            message: "Backdrop deve ser uma imagem (JPEG, PNG, WEBP ou GIF)",
          });
        }

        const uploadPromises = [];
        if (files.poster) {
          uploadPromises.push(uploadFileToS3(files.poster, "posters"));
        }
        if (files.backdrop) {
          uploadPromises.push(uploadFileToS3(files.backdrop, "backdrops"));
        }

        const uploadResults = await Promise.all(uploadPromises);

        let posterUrl = existingMovie.posterUrl;
        let backdropUrl = existingMovie.backdropUrl;

        if (files.poster) {
          posterUrl = uploadResults[0].url;
        }
        if (files.backdrop) {
          backdropUrl = files.poster
            ? uploadResults[1].url
            : uploadResults[0].url;
        }

        let genres = fields.genres;
        if (genres) {
          if (typeof genres === "string") {
            try {
              genres = JSON.parse(genres);
            } catch {
              genres = [genres];
            }
          }
        }

        const updateData: any = {
          updatedAt: new Date(),
        };

        if (fields.title !== undefined) updateData.title = fields.title;
        if (fields.originalTitle !== undefined)
          updateData.originalTitle = fields.originalTitle;
        if (fields.tagline !== undefined)
          updateData.tagline = fields.tagline || null;
        if (fields.synopsis !== undefined)
          updateData.synopsis = fields.synopsis;
        if (fields.language !== undefined)
          updateData.language = fields.language;
        if (fields.releaseDate !== undefined)
          updateData.releaseDate = fields.releaseDate;
        if (fields.durationMinutes !== undefined)
          updateData.durationMinutes = Number(fields.durationMinutes);
        if (fields.status !== undefined) updateData.status = fields.status;
        if (fields.budget !== undefined)
          updateData.budget = fields.budget.toString();
        if (fields.revenue !== undefined)
          updateData.revenue = fields.revenue.toString();
        if (fields.profit !== undefined)
          updateData.profit = fields.profit.toString();
        if (fields.votes !== undefined) updateData.votes = Number(fields.votes);
        if (fields.rating !== undefined)
          updateData.rating = fields.rating.toString();
        if (fields.ageRating !== undefined)
          updateData.ageRating = Number(fields.ageRating);
        if (fields.trailerUrl !== undefined)
          updateData.trailerUrl = fields.trailerUrl;
        if (genres !== undefined) updateData.genres = genres;

        updateData.posterUrl = posterUrl;
        updateData.backdropUrl = backdropUrl;

        const [updatedMovie] = await db
          .update(movies)
          .set(updateData)
          .where(eq(movies.id, id))
          .returning();

        return reply.status(200).send(updatedMovie);
      } catch (err) {
        console.error(err);
        return reply.status(400).send({
          message: "Erro ao atualizar filme: " + (err as Error).message,
        });
      }
    }
  );
};
