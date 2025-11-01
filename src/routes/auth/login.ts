import { db } from "@/db";
import { users } from "@/db/schema";
import passwordUtils from "@/utils/password";
import session from "@/utils/session";
import { eq } from "drizzle-orm";
import { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import z from "zod";

export const login: FastifyPluginAsyncZod = async (app) => {
  app.post(
    "/api/auth/login",
    {
      schema: {
        summary: "Login user",
        tags: ["Auth"],
        body: z.object({
          email: z.string().email(),
          password: z.string(),
        }),
        response: {
          200: z.object({
            user: z.object({
              id: z.string().uuid(),
              name: z.string(),
              email: z.string(),
            }),
          }),
          401: z.object({
            message: z.string(),
          }),
        },
      },
    },
    async (request, reply) => {
      const { email, password } = request.body;

      try {
        const [user] = await db
          .select()
          .from(users)
          .where(eq(users.email, email))
          .limit(1);

        if (!user) {
          return reply.status(401).send({ message: "Credenciais inválidas" });
        }

        const isPasswordValid = await passwordUtils.compare(
          password,
          user.password
        );

        if (!isPasswordValid) {
          return reply.status(401).send({ message: "Credenciais inválidas" });
        }

        await session.createSession(reply, user.id);

        return reply.status(200).send({
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
          },
        });
      } catch (err) {
        console.error(err);
        return reply.status(401).send({ message: "Erro ao fazer login" });
      }
    }
  );
};
