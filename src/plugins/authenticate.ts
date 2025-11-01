import session from "@/utils/session";
import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import fastifyPlugin from "fastify-plugin";

declare module "fastify" {
  interface FastifyRequest {
    user?: {
      id: string;
      name: string;
      email: string;
      createdAt: Date;
    };
    session_token?: string;
  }

  interface FastifyInstance {
    authenticate: (
      request: FastifyRequest,
      reply: FastifyReply
    ) => Promise<void>;
  }
}

async function authenticatePlugin(app: FastifyInstance) {
  app.decorate(
    "authenticate",
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        const session_token = request.cookies.session_token;

        if (!session_token) {
          return reply.status(401).send({ message: "Não autenticado" });
        }

        const sessionData = await session.getUserSession(session_token);

        if (!sessionData) {
          reply.clearCookie("session_token", { path: "/" });
          return reply
            .status(401)
            .send({ message: "Sessão inválida ou expirada" });
        }

        request.user = sessionData.user;
        request.session_token = session_token;
      } catch (err) {
        console.error(err);
        return reply.status(401).send({ message: "Erro na autenticação" });
      }
    }
  );
}

export default fastifyPlugin(authenticatePlugin);
