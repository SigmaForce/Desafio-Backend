import { db } from "@/db";
import { users } from "@/db/schema";
import passwordUtils from "@/utils/password";
import { eq } from "drizzle-orm";
import { createSelectSchema } from "drizzle-zod";
import { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { z } from "zod";

export const createUser: FastifyPluginAsyncZod = async (app) => {
  app.post(
    "/api/users",
    {
      schema: {
        summary: "Create user",
        tags: ["Users"],
        body: z.object({
          name: z.string(),
          email: z.email(),
          password: z.string(),
        }),
        response: {
          200: createSelectSchema(users),
          404: z.object({
            message: z.string(),
          }),
        },
      },
    },
    async (request, reply) => {
      const { name, email, password } = request.body;

      const existingUser = await db
        .select({
          id: users.id,
          name: users.name,
          email: users.email,
        })
        .from(users)
        .where(eq(users.email, email))
        .limit(1);

      if (existingUser.length > 0) {
        return reply
          .status(404)
          .send({ message: "Utilize outro e-mail para criação da conta." });
      }

      const hashedPassword = await passwordUtils.hash(password);

      const newUser = await db
        .insert(users)
        .values({
          name,
          email,
          password: hashedPassword,
        })
        .returning();

      return reply.status(200).send(newUser[0]);
    }
  );
};
