import session from "@/utils/session";
import { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { z } from "zod";

export const me: FastifyPluginAsyncZod = async (app) => {
  app.get(
    "/api/auth/me",
    {
      onRequest: [app.authenticate],
      schema: {
        summary: "Get current user",
        tags: ["Auth"],
        response: {
          200: z.object({
            user: z.object({
              id: z.string(),
              name: z.string(),
              email: z.email(),
            }),
          }),
          401: z.object({
            message: z.string(),
          }),
        },
      },
    },
    async (request, reply) => {
      const sessionToken = request.session_token!;

      const sessionData = await session.getUserSession(sessionToken);

      if (!sessionData) {
        return reply.status(401).send({
          message: "Sessão inválida ou expirada",
        });
      }

      return reply.status(200).send({
        user: {
          id: sessionData.user.id,
          name: sessionData.user.name,
          email: sessionData.user.email,
        },
      });
    }
  );
};
