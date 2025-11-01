import session from "@/utils/session";
import { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { z } from "zod";

export const logout: FastifyPluginAsyncZod = async (app) => {
  app.post(
    "/api/auth/logout",
    {
      onRequest: [app.authenticate],
      schema: {
        summary: "Logout user",
        tags: ["Auth"],
        response: {
          200: z.object({
            message: z.string(),
          }),
        },
      },
    },
    async (request, reply) => {
      const sessionToken = request.session_token!;

      await session.deleteSession(sessionToken);

      reply.clearCookie("session_token", {
        path: "/",
      });

      return reply
        .status(200)
        .send({ message: "Logout realizado com sucesso" });
    }
  );
};
