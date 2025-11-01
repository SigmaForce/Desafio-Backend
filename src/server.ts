import { fastify } from "fastify";
import {
  jsonSchemaTransform,
  serializerCompiler,
  validatorCompiler,
  type ZodTypeProvider,
} from "fastify-type-provider-zod";

import fastifyCookie from "@fastify/cookie";
import { fastifyCors } from "@fastify/cors";
import { fastifySwagger } from "@fastify/swagger";
import ScalarApiReference from "@scalar/fastify-api-reference";
import { env } from "./env";

import authenticatePlugin from "./plugins/authenticate";
import { login } from "./routes/auth/login";
import { logout } from "./routes/auth/logout";
import { createMovie } from "./routes/movies/create-movie";
import { deleteMovie } from "./routes/movies/delete-movie";
import { listMovie } from "./routes/movies/list-movie";
import { listMovies } from "./routes/movies/list-movies";
import { updateMovie } from "./routes/movies/update-movie";
import { createUser } from "./routes/user/create-user";

const app = fastify().withTypeProvider<ZodTypeProvider>();

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

app.register(fastifyCors, {
  origin: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
});

app.register(fastifyCookie, {
  secret: process.env.COOKIE_SECRET || "my-secret-key-change-in-production",
  parseOptions: {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
  },
});

app.register(fastifySwagger, {
  openapi: {
    info: {
      title: "Movies API",
      version: "1.0.0",
    },
  },
  transform: jsonSchemaTransform,
});

app.register(ScalarApiReference, {
  routePrefix: "/docs",
});

app.register(authenticatePlugin);
app.register(createUser);

app.register(login);
app.register(logout);

app.register(createMovie);
app.register(deleteMovie);
app.register(updateMovie);
app.register(listMovies);
app.register(listMovie);

app.listen({ port: env.PORT, host: "0.0.0.0" }).then(() => {
  console.log(`HTTP server running on http://localhost:${env.PORT}`);
  console.log(`Docs available at http://localhost:${env.PORT}/docs`);
});
