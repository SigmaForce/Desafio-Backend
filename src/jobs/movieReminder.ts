import { db } from "@/db";
import { movies } from "@/db/schema/movies";
import { users } from "@/db/schema/users";
import { sendMovieReminderEmail } from "@/services/email-service";
import { and, eq, gte, lte } from "drizzle-orm";
import cron from "node-cron";

export function movieReminder() {
  cron.schedule("0 9 * * *", async () => {
    console.log("🎬 Verificando filmes lançando hoje...");

    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      const moviesReleasingToday = await db
        .select({
          movie: movies,
          user: users,
        })
        .from(movies)
        .innerJoin(users, eq(movies.userId, users.id))
        .where(
          and(
            gte(movies.releaseDate, today.toISOString()),
            lte(movies.releaseDate, tomorrow.toISOString())
          )
        );

      console.log(`📧 Enviando ${moviesReleasingToday.length} lembretes...`);

      await Promise.all(
        moviesReleasingToday.map(({ movie, user }) =>
          sendMovieReminderEmail({
            to: user.email,
            userName: user.name,
            movieTitle: movie.title,
            moviePoster: movie.posterUrl,
            releaseDate: movie.releaseDate,
            movieId: movie.id,
          })
        )
      );

      console.log("✅ Lembretes enviados com sucesso!");
    } catch (error) {
      console.error("❌ Erro ao enviar lembretes:", error);
    }
  });

  console.log("⏰ Scheduler de lembretes iniciado!");
}
