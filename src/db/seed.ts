import { db } from ".";
import { movies } from "./schema/movies";
import { users } from "./schema/users";

async function seedMovies() {
  try {
    const existingUsers = await db.select().from(users).limit(1);

    let userId: string;

    if (existingUsers.length === 0) {
      const [newUser] = await db
        .insert(users)
        .values({
          name: "Admin Seed",
          email: "admin@seed.com",
          password: "123456",
        })
        .returning();
      userId = newUser.id;
    } else {
      userId = existingUsers[0].id;
    }

    const moviesData = [
      {
        title: "O Poderoso Chefão",
        originalTitle: "The Godfather",
        tagline: "Uma oferta que você não pode recusar",
        synopsis:
          "Don Vito Corleone é o chefe de uma 'família' de Nova York que está feliz, desde que os negócios sigam bem. O problema é que o chefe de uma família rival quer entrar no negócio de drogas, coisa que Don Vito não aprova.",
        language: "pt-BR",
        releaseDate: "1972-03-24",
        durationMinutes: 175,
        status: "released",
        budget: "6000000.00",
        revenue: "246120974.00",
        profit: "240120974.00",
        votes: 18420,
        rating: "8.70",
        ageRating: 16,
        posterUrl:
          "https://image.tmdb.org/t/p/w500/3bhkrj58Vtu7enYsRolD1fZdja1.jpg",
        backdropUrl:
          "https://image.tmdb.org/t/p/original/tmU7GeKVybMWFButWEGl2M4GeiP.jpg",
        trailerUrl: "https://www.youtube.com/watch?v=sY1S34973zA",
        genres: ["Drama", "Crime"],
        userId,
      },
      {
        title: "A Origem",
        originalTitle: "Inception",
        tagline: "Sua mente é o cenário do crime",
        synopsis:
          "Dom Cobb é um ladrão com a rara habilidade de roubar segredos do inconsciente, obtidos durante o estado de sono. Impedido de retornar para sua família, ele recebe a oportunidade de se redimir ao realizar uma tarefa aparentemente impossível: plantar uma ideia na mente do herdeiro de um império.",
        language: "pt-BR",
        releaseDate: "2010-07-16",
        durationMinutes: 148,
        status: "released",
        budget: "160000000.00",
        revenue: "836848102.00",
        profit: "676848102.00",
        votes: 33580,
        rating: "8.40",
        ageRating: 14,
        posterUrl:
          "https://image.tmdb.org/t/p/w500/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg",
        backdropUrl:
          "https://image.tmdb.org/t/p/original/s3TBrRGB1iav7gFOCNx3H31MoES.jpg",
        trailerUrl: "https://www.youtube.com/watch?v=YoHD9XEInc0",
        genres: ["Ação", "Ficção Científica", "Suspense"],
        userId,
      },
      {
        title: "Pulp Fiction: Tempo de Violência",
        originalTitle: "Pulp Fiction",
        tagline: "Você não vai saber os fatos até ter visto a ficção",
        synopsis:
          "Assassino que trabalha para a máfia se apaixona pela esposa de seu chefe quando é convidado a acompanhá-la, um boxeador descumpre sua promessa de perder uma luta e um casal tenta um assalto que rapidamente sai do controle.",
        language: "pt-BR",
        releaseDate: "1994-10-14",
        durationMinutes: 154,
        status: "released",
        budget: "8000000.00",
        revenue: "213928762.00",
        profit: "205928762.00",
        votes: 26740,
        rating: "8.50",
        ageRating: 18,
        posterUrl:
          "https://image.tmdb.org/t/p/w500/d5iIlFn5s0ImszYzBPb8JPIfbXD.jpg",
        backdropUrl:
          "https://image.tmdb.org/t/p/original/suaEOtk1N1sgg2MTM7oZd2cfVp3.jpg",
        trailerUrl: "https://www.youtube.com/watch?v=s7EdQ4FqbhY",
        genres: ["Crime", "Suspense"],
        userId,
      },
      {
        title: "Interestelar",
        originalTitle: "Interstellar",
        tagline:
          "A humanidade nasceu na Terra. Nunca foi destinada a morrer aqui",
        synopsis:
          "As reservas naturais da Terra estão chegando ao fim e um grupo de astronautas recebe a missão de verificar possíveis planetas para receberem a população mundial, possibilitando a continuação da espécie humana.",
        language: "pt-BR",
        releaseDate: "2014-11-07",
        durationMinutes: 169,
        status: "released",
        budget: "165000000.00",
        revenue: "677463813.00",
        profit: "512463813.00",
        votes: 31250,
        rating: "8.40",
        ageRating: 10,
        posterUrl:
          "https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg",
        backdropUrl:
          "https://image.tmdb.org/t/p/original/xJHokMbljvjADYdit5fK5VQsXEG.jpg",
        trailerUrl: "https://www.youtube.com/watch?v=zSWdZVtXT7E",
        genres: ["Aventura", "Drama", "Ficção Científica"],
        userId,
      },
      {
        title: "Clube da Luta",
        originalTitle: "Fight Club",
        tagline: "Mischief. Mayhem. Soap.",
        synopsis:
          "Um funcionário de escritório insone e um fabricante de sabão formam um clube de luta clandestino que evolui para algo muito mais.",
        language: "pt-BR",
        releaseDate: "1999-10-15",
        durationMinutes: 139,
        status: "released",
        budget: "63000000.00",
        revenue: "100853753.00",
        profit: "37853753.00",
        votes: 27890,
        rating: "8.40",
        ageRating: 18,
        posterUrl:
          "https://image.tmdb.org/t/p/w500/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg",
        backdropUrl:
          "https://image.tmdb.org/t/p/original/hZkgoQYus5vegHoetLkCJzb17zJ.jpg",
        trailerUrl: "https://www.youtube.com/watch?v=BdJKm16Co6M",
        genres: ["Drama"],
        userId,
      },
      {
        title: "Matrix",
        originalTitle: "The Matrix",
        tagline: "Bem-vindo ao mundo real",
        synopsis:
          "Um hacker descobre que a realidade como ele a conhece é uma simulação criada por máquinas, e se junta a uma rebelião para libertá-la.",
        language: "pt-BR",
        releaseDate: "1999-03-31",
        durationMinutes: 136,
        status: "released",
        budget: "63000000.00",
        revenue: "463517383.00",
        profit: "400517383.00",
        votes: 23450,
        rating: "8.20",
        ageRating: 14,
        posterUrl:
          "https://image.tmdb.org/t/p/w500/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg",
        backdropUrl:
          "https://image.tmdb.org/t/p/original/fNG7i7RqMErkcqhohV2a6cV1Ehy.jpg",
        trailerUrl: "https://www.youtube.com/watch?v=m8e-FF8MsqU",
        genres: ["Ação", "Ficção Científica"],
        userId,
      },
      {
        title: "Forrest Gump: O Contador de Histórias",
        originalTitle: "Forrest Gump",
        tagline: "A vida é como uma caixa de chocolates",
        synopsis:
          "Forrest Gump, um homem com QI baixo, presencia e, involuntariamente, influencia vários eventos históricos no século XX.",
        language: "pt-BR",
        releaseDate: "1994-07-06",
        durationMinutes: 142,
        status: "released",
        budget: "55000000.00",
        revenue: "678226465.00",
        profit: "623226465.00",
        votes: 25680,
        rating: "8.50",
        ageRating: 12,
        posterUrl:
          "https://image.tmdb.org/t/p/w500/arw2vcBveWOVZr6pxd9XTd1TdQa.jpg",
        backdropUrl:
          "https://image.tmdb.org/t/p/original/3h1JZGDhZ8nzxdgvkxha0qBqi05.jpg",
        trailerUrl: "https://www.youtube.com/watch?v=bLvqoHBptjg",
        genres: ["Drama", "Romance"],
        userId,
      },
      {
        title: "Parasita",
        originalTitle: "기생충",
        tagline: "Aja como se você pertencesse",
        synopsis:
          "Toda a família de Ki-taek está desempregada, vivendo em um porão sujo. Uma obra do acaso faz com que o filho adolescente da família comece a dar aulas de inglês à garota de uma família rica. Fascinados com a vida luxuosa destas pessoas, pai, mãe, filho e filha bolam um plano para se infiltrarem também na família burguesa.",
        language: "ko",
        releaseDate: "2019-05-30",
        durationMinutes: 133,
        status: "released",
        budget: "11400000.00",
        revenue: "258543537.00",
        profit: "247143537.00",
        votes: 16780,
        rating: "8.50",
        ageRating: 16,
        posterUrl:
          "https://image.tmdb.org/t/p/w500/7IiTTgloJzvGI1TAYymCfbfl3vT.jpg",
        backdropUrl:
          "https://image.tmdb.org/t/p/original/TU9NIjwzjoKPwQHoHshkFcQUCG.jpg",
        trailerUrl: "https://www.youtube.com/watch?v=5xH0HfJHsaY",
        genres: ["Comédia", "Suspense", "Drama"],
        userId,
      },
      {
        title: "O Silêncio dos Inocentes",
        originalTitle: "The Silence of the Lambs",
        tagline:
          "Para pegar um assassino, ela deve ganhar a confiança de outro",
        synopsis:
          "Uma jovem agente do FBI busca a ajuda de um prisioneiro psicopata para capturar um serial killer.",
        language: "pt-BR",
        releaseDate: "1991-02-14",
        durationMinutes: 118,
        status: "released",
        budget: "19000000.00",
        revenue: "272742922.00",
        profit: "253742922.00",
        votes: 14230,
        rating: "8.30",
        ageRating: 18,
        posterUrl:
          "https://image.tmdb.org/t/p/w500/uS9m8OBk1A8eM9I042bx8XXpqAq.jpg",
        backdropUrl:
          "https://image.tmdb.org/t/p/original/kDr5qNvfsqdVJd3GmBHqjqBQjR7.jpg",
        trailerUrl: "https://www.youtube.com/watch?v=W6Mm8Sbe__o",
        genres: ["Crime", "Drama", "Suspense"],
        userId,
      },
      {
        title: "Cidade de Deus",
        originalTitle: "City of God",
        tagline: "Lute por sua sobrevivência. Reze por sua salvação",
        synopsis:
          "Buscapé é um jovem pobre, negro e muito sensível, que cresce em um universo de muita violência. Buscapé vive na Cidade de Deus, favela carioca conhecida por ser um dos locais mais violentos da cidade.",
        language: "pt-BR",
        releaseDate: "2002-08-30",
        durationMinutes: 130,
        status: "released",
        budget: "3300000.00",
        revenue: "30680793.00",
        profit: "27380793.00",
        votes: 12890,
        rating: "8.40",
        ageRating: 18,
        posterUrl:
          "https://image.tmdb.org/t/p/w500/k7eYdcdYEYBHXNEYY4u3NXrSi5F.jpg",
        backdropUrl:
          "https://image.tmdb.org/t/p/original/bADhq6L8u51rLOJ0AObF2dJmJdB.jpg",
        trailerUrl: "https://www.youtube.com/watch?v=dcUOO4Itgmw",
        genres: ["Drama", "Crime"],
        userId,
      },
      {
        title: "Vingadores: Ultimato",
        originalTitle: "Avengers: Endgame",
        tagline: "Vingue os caídos",
        synopsis:
          "Após Thanos eliminar metade das criaturas vivas, os Vingadores têm de lidar com a perda de amigos e entes queridos. Com Tony Stark vagando perdido no espaço sem água e comida, Steve Rogers e Natasha Romanov lideram a resistência contra o titã louco.",
        language: "pt-BR",
        releaseDate: "2019-04-26",
        durationMinutes: 181,
        status: "released",
        budget: "356000000.00",
        revenue: "2797800564.00",
        profit: "2441800564.00",
        votes: 24560,
        rating: "8.30",
        ageRating: 12,
        posterUrl:
          "https://image.tmdb.org/t/p/w500/or06FN3Dka5tukK1e9sl16pB3iy.jpg",
        backdropUrl:
          "https://image.tmdb.org/t/p/original/7RyHsO4yDXtBv1zUU3mTpHeQ0d5.jpg",
        trailerUrl: "https://www.youtube.com/watch?v=TcMBFSGVi1c",
        genres: ["Aventura", "Ficção Científica", "Ação"],
        userId,
      },
      {
        title: "Coringa",
        originalTitle: "Joker",
        tagline: "Coloque um sorriso nesse rosto",
        synopsis:
          "Isolado, intimidado e desconsiderado pela sociedade, o fracassado comediante Arthur Fleck inicia seu caminho como uma mente criminosa após assassinar três homens em pleno metrô.",
        language: "pt-BR",
        releaseDate: "2019-10-04",
        durationMinutes: 122,
        status: "released",
        budget: "55000000.00",
        revenue: "1074251311.00",
        profit: "1019251311.00",
        votes: 22340,
        rating: "8.20",
        ageRating: 18,
        posterUrl:
          "https://image.tmdb.org/t/p/w500/udDclJoHjfjb8Ekgsd4FDteOkCU.jpg",
        backdropUrl:
          "https://image.tmdb.org/t/p/original/n6bUvigpRFqSwmPp1m2YADdbRBc.jpg",
        trailerUrl: "https://www.youtube.com/watch?v=zAGVQLHvwOY",
        genres: ["Crime", "Suspense", "Drama"],
        userId,
      },
      {
        title: "De Volta para o Futuro",
        originalTitle: "Back to the Future",
        tagline: "Ele estava no lugar certo... na hora errada",
        synopsis:
          "Marty McFly, um adolescente de 17 anos, é enviado acidentalmente de volta no tempo, de 1985 para 1955, em um DeLorean viajante do tempo, inventado por seu amigo Doc Brown.",
        language: "pt-BR",
        releaseDate: "1985-07-03",
        durationMinutes: 116,
        status: "released",
        budget: "19000000.00",
        revenue: "381109762.00",
        profit: "362109762.00",
        votes: 18760,
        rating: "8.30",
        ageRating: 10,
        posterUrl:
          "https://image.tmdb.org/t/p/w500/fNOH9f1aA7XRTzl1sAOx9iF553Q.jpg",
        backdropUrl:
          "https://image.tmdb.org/t/p/original/5W9AMA0TqCkPNAIaMDdmWT6y2mA.jpg",
        trailerUrl: "https://www.youtube.com/watch?v=qvsgGtivCgs",
        genres: ["Aventura", "Comédia", "Ficção Científica"],
        userId,
      },
      {
        title: "Django Livre",
        originalTitle: "Django Unchained",
        tagline: "A vida, a liberdade e a busca pela vingança",
        synopsis:
          "No sul dos Estados Unidos, o ex-escravo Django faz uma aliança inesperada com o caçador de recompensas Schultz para caçar os criminosos mais procurados do país e resgatar sua esposa de um cruel proprietário de plantação.",
        language: "pt-BR",
        releaseDate: "2012-12-25",
        durationMinutes: 165,
        status: "released",
        budget: "100000000.00",
        revenue: "425368238.00",
        profit: "325368238.00",
        votes: 19450,
        rating: "8.20",
        ageRating: 18,
        posterUrl:
          "https://image.tmdb.org/t/p/w500/7oWY8VDWW7thTzWh3OKYRkWUlD5.jpg",
        backdropUrl:
          "https://image.tmdb.org/t/p/original/2oZklIzUbvZXXzIFzv7Hi68d6xf.jpg",
        trailerUrl: "https://www.youtube.com/watch?v=0fUCuvNlOCg",
        genres: ["Drama", "Faroeste"],
        userId,
      },
      {
        title: "Gladiador",
        originalTitle: "Gladiator",
        tagline: "Um herói nascerá",
        synopsis:
          "Maximus é um poderoso general romano, amado pelo povo e pelo imperador Marco Aurélio. Antes de sua morte, o Imperador escolhe Maximus para ser seu herdeiro, em detrimento de seu filho Commodus. Sedento pelo poder, Commodus mata seu pai, assume a coroa e ordena a morte de Maximus.",
        language: "pt-BR",
        releaseDate: "2000-05-05",
        durationMinutes: 155,
        status: "released",
        budget: "103000000.00",
        revenue: "460583960.00",
        profit: "357583960.00",
        votes: 16890,
        rating: "8.20",
        ageRating: 16,
        posterUrl:
          "https://image.tmdb.org/t/p/w500/ty8TGRuvJLPUmAR1H1nRIsgwvim.jpg",
        backdropUrl:
          "https://image.tmdb.org/t/p/original/xEKGUCXJi5U5q3Jjz9ZOb0p0t1T.jpg",
        trailerUrl: "https://www.youtube.com/watch?v=uvbavW31adA",
        genres: ["Ação", "Drama", "Aventura"],
        userId,
      },
      {
        title: "O Rei Leão",
        originalTitle: "The Lion King",
        tagline:
          "A maior aventura de todas é encontrar nosso lugar no círculo da vida",
        synopsis:
          "Simba é um jovem leão cujo destino é se tornar o rei da selva. Entretanto, uma armadilha elaborada por seu tio Scar faz com que Mufasa, o atual rei, morra ao tentar salvar o filhote. Consumido pela culpa, Simba deixa o reino rumo a um local distante.",
        language: "pt-BR",
        releaseDate: "1994-06-24",
        durationMinutes: 88,
        status: "released",
        budget: "45000000.00",
        revenue: "968483777.00",
        profit: "923483777.00",
        votes: 16230,
        rating: "8.30",
        ageRating: 0,
        posterUrl:
          "https://image.tmdb.org/t/p/w500/sKCr78MXSLixwmZ8DyJLrpMsd15.jpg",
        backdropUrl:
          "https://image.tmdb.org/t/p/original/1TJHmxPeHApz44fWvtZnIitO8tq.jpg",
        trailerUrl: "https://www.youtube.com/watch?v=4CbLXeGSDxg",
        genres: ["Família", "Animação", "Drama"],
        userId,
      },
      {
        title: "Os Infiltrados",
        originalTitle: "The Departed",
        tagline:
          "Mentiras. Traição. Sacrifício. Quão longe você iria para proteger seu segredo?",
        synopsis:
          "Billy Costigan é um jovem policial que se infiltra na máfia de Boston para obter informações. Enquanto isso, Colin Sullivan, um criminoso que se infiltrou na polícia, se esforça para descobrir a identidade do infiltrado.",
        language: "pt-BR",
        releaseDate: "2006-10-06",
        durationMinutes: 151,
        status: "released",
        budget: "90000000.00",
        revenue: "291465034.00",
        profit: "201465034.00",
        votes: 13670,
        rating: "8.20",
        ageRating: 18,
        posterUrl:
          "https://image.tmdb.org/t/p/w500/nT97ifVT2J1yMQmeq20Qblg61T.jpg",
        backdropUrl:
          "https://image.tmdb.org/t/p/original/8Od5zV7Q7V0bEwHLYOWecTkDiKg.jpg",
        trailerUrl: "https://www.youtube.com/watch?v=SGWvwjZ0eDc",
        genres: ["Drama", "Suspense", "Crime"],
        userId,
      },
      {
        title: "Pantera Negra",
        originalTitle: "Black Panther",
        tagline: "Há muito tempo em Wakanda",
        synopsis:
          "Após a morte do rei T'Chaka, o príncipe T'Challa retorna a Wakanda para a cerimônia de coroação. Nela são reunidas as cinco tribos que compõem o reino, sendo que uma delas, os Jabari, não apoia o atual governo.",
        language: "pt-BR",
        releaseDate: "2018-02-16",
        durationMinutes: 134,
        status: "released",
        budget: "200000000.00",
        revenue: "1346913161.00",
        profit: "1146913161.00",
        votes: 20890,
        rating: "7.40",
        ageRating: 12,
        posterUrl:
          "https://image.tmdb.org/t/p/w500/uxzzxijgPIY7slzFvMotPv8wjKA.jpg",
        backdropUrl:
          "https://image.tmdb.org/t/p/original/b6ZJZHUdMEFECvGiDpJjlfUWela.jpg",
        trailerUrl: "https://www.youtube.com/watch?v=xjDjIWPwcPU",
        genres: ["Ação", "Aventura", "Ficção Científica"],
        userId,
      },
      {
        title: "Whiplash: Em Busca da Perfeição",
        originalTitle: "Whiplash",
        tagline: "O caminho para a grandeza pode levar você ao limite",
        synopsis:
          "Andrew sonha em se tornar um grande baterista de jazz. Quando ele é selecionado para tocar na melhor orquestra de uma escola de música de elite, ele pensa ter alcançado seu objetivo, mas encontra um professor tirano que fará de tudo para que ele atinja a perfeição.",
        language: "pt-BR",
        releaseDate: "2014-10-10",
        durationMinutes: 106,
        status: "released",
        budget: "3300000.00",
        revenue: "48985940.00",
        profit: "45685940.00",
        votes: 13250,
        rating: "8.30",
        ageRating: 14,
        posterUrl:
          "https://image.tmdb.org/t/p/w500/7fn624j5lj3xTme2SgiLCeuedmO.jpg",
        backdropUrl:
          "https://image.tmdb.org/t/p/original/6bbZ6XyvgfjhQwbplnUh1LSj1ky.jpg",
        trailerUrl: "https://www.youtube.com/watch?v=7d_jQycdQGo",
        genres: ["Drama", "Música"],
        userId,
      },
      {
        title: "Avatar",
        originalTitle: "Avatar",
        tagline: "Entre em um novo mundo",
        synopsis:
          "Jake Sully é um ex-fuzileiro naval paralítico que é enviado para o planeta Pandora, onde uma empresa está explorando um mineral valioso. Para interagir com os nativos Na'vi, Jake participa de um programa que permite que sua consciência opere um corpo Na'vi.",
        language: "pt-BR",
        releaseDate: "2009-12-18",
        durationMinutes: 162,
        status: "released",
        budget: "237000000.00",
        revenue: "2923706026.00",
        profit: "2686706026.00",
        votes: 28450,
        rating: "7.60",
        ageRating: 12,
        posterUrl:
          "https://image.tmdb.org/t/p/w500/kyeqWdyUXW608qlYkRqosgbbJyK.jpg",
        backdropUrl:
          "https://image.tmdb.org/t/p/original/Yc9q6QuWrMp9nuDm5R8ExNqbEq.jpg",
        trailerUrl: "https://www.youtube.com/watch?v=5PSNL1qE6VY",
        genres: ["Ação", "Aventura", "Fantasia", "Ficção Científica"],
        userId,
      },
    ];

    console.log("Iniciando seed de filmes...");

    const insertedMovies = await db
      .insert(movies)
      .values(moviesData)
      .returning();

    console.log(`✅ ${insertedMovies.length} filmes inseridos com sucesso!`);
    console.log("Filmes adicionados:");
    insertedMovies.forEach((movie) => {
      console.log(`  - ${movie.title} (${movie.releaseDate})`);
    });
  } catch (error) {
    console.error("❌ Erro ao fazer seed dos filmes:", error);
    throw error;
  }
}

seedMovies()
  .then(() => {
    console.log("\n🎬 Seed de filmes concluído!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("\n💥 Falha no seed:", error);
    process.exit(1);
  });
