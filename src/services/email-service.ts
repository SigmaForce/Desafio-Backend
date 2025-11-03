import { env } from "@/env";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

interface MovieReminderData {
  to: string;
  userName: string;
  movieTitle: string;
  moviePoster: string;
  releaseDate: string;
  movieId: string;
}

export async function sendMovieReminderEmail(data: MovieReminderData) {
  try {
    const { data: emailData, error } = await resend.emails.send({
      from: "Movies App <onboarding@resend.dev>",
      to: data.to,
      subject: `🎬 ${data.movieTitle} estreia hoje!`,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>
              body {
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
                line-height: 1.6;
                margin: 0;
                padding: 0;
                background-color: #f4f4f5;
              }
              .container {
                max-width: 600px;
                margin: 40px auto;
                background: white;
                border-radius: 12px;
                overflow: hidden;
                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
              }
              .header {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                padding: 40px 20px;
                text-align: center;
              }
              .header h1 {
                margin: 0;
                font-size: 28px;
                font-weight: 700;
              }
              .content {
                padding: 40px 30px;
              }
              .greeting {
                font-size: 18px;
                color: #18181b;
                margin-bottom: 20px;
              }
              .movie-info {
                background: #f4f4f5;
                border-radius: 8px;
                padding: 20px;
                margin: 20px 0;
              }
              .movie-poster {
                width: 100%;
                max-width: 300px;
                height: auto;
                border-radius: 8px;
                margin: 20px auto;
                display: block;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
              }
              .movie-title {
                font-size: 24px;
                font-weight: 700;
                color: #18181b;
                margin: 10px 0;
              }
              .release-info {
                color: #71717a;
                font-size: 14px;
              }
              .cta-button {
                display: inline-block;
                padding: 14px 32px;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                text-decoration: none;
                border-radius: 8px;
                font-weight: 600;
                margin-top: 20px;
                transition: transform 0.2s;
              }
              .cta-button:hover {
                transform: translateY(-2px);
              }
              .footer {
                text-align: center;
                padding: 20px;
                color: #71717a;
                font-size: 12px;
                border-top: 1px solid #e4e4e7;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>🎬 Estreia Hoje!</h1>
              </div>
              <div class="content">
                <p class="greeting">Olá, <strong>${
                  data.userName
                }</strong>! 👋</p>
                <p>O filme que você adicionou acaba de ser lançado!</p>
                
                <div class="movie-info">
                  <img src="${data.moviePoster}" alt="${
        data.movieTitle
      }" class="movie-poster" />
                  <h2 class="movie-title">${data.movieTitle}</h2>
                  <p class="release-info">📅 Data de lançamento: ${new Date(
                    data.releaseDate
                  ).toLocaleDateString("pt-BR")}</p>
                </div>

                <p>Não perca a oportunidade de assistir! 🍿</p>
                
                <center>
                  <a href="${env.WEB_URL}/movies/${
        data.movieId
      }" class="cta-button">
                    Ver Detalhes do Filme
                  </a>
                </center>
              </div>
              <div class="footer">
                <p>Você está recebendo este e-mail porque adicionou este filme ao catálogo.</p>
                <p>© ${new Date().getFullYear()} Movies App. Todos os direitos reservados.</p>
              </div>
            </div>
          </body>
        </html>
      `,
    });

    if (error) {
      console.error(`❌ Erro ao enviar e-mail para ${data.to}:`, error);
      return;
    }

    console.log(`✅ E-mail enviado para ${data.to} (ID: ${emailData?.id})`);
  } catch (error) {
    console.error(`❌ Erro ao enviar e-mail:`, error);
  }
}
