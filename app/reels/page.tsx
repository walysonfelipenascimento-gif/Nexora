"use client";

import PrimaryNav from "../components/PrimaryNav";
import { extraReels, imageForCaption } from "./extraReels";
import { useEffect, useRef, useState } from "react";
import { getSavedLanguage, translate, type NexoraLanguage } from "../../lib/i18n";

type Reel = {
  id: number;
  user: string;
  name: string;
  avatar: string;
  caption: string;
  song: string;
  likes: number;
  comments: number;
  shares: number;
  video: string;
  tint: string;
  image?: string;
};

const demoReels: Reel[] = [
  { id: 1, user: "flores.em.movimento", name: "Flores em Movimento", avatar: "https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=120&h=120&fit=crop", caption: "Um instante de calma: veja uma flor se abrir diante dos seus olhos. 🌸✨", song: "Natureza em foco · som ambiente", likes: 28400, comments: 1840, shares: 927, video: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4", tint: "sunset" },
  { id: 2, user: "mundosempressa", name: "Mundo sem pressa", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&h=120&fit=crop", caption: "Um lugar tão surreal que parece outro planeta. Você visitaria? 🌋", song: "Natureza em foco · áudio demo", likes: 19300, comments: 742, shares: 1260, video: "https://storage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4", tint: "violet" },
  { id: 3, user: "memes.da.nexa", name: "Memes da Nexa", avatar: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=120&h=120&fit=crop", caption: "Eu ensaiando a resposta perfeita… e na hora falando “pois é né” 🤡", song: "Humor de milhões · áudio demo", likes: 36200, comments: 2310, shares: 3100, video: "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4", tint: "violet" },
  { id: 4, user: "rotas.secretas", name: "Rotas Secretas", avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=120&h=120&fit=crop", caption: "Uma lagoa escondida entre montanhas. Salva esse destino para sonhar depois. 💎", song: "Diário de viagem · áudio demo", likes: 15700, comments: 598, shares: 1830, video: "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4", tint: "sunset" },
  { id: 5, user: "vida.real.ofc", name: "Vida Real", avatar: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=120&h=120&fit=crop", caption: "Quando a pessoa diz “não estou com fome” e começa a comer do seu prato 😭🍟", song: "Expectativa x realidade · áudio demo", likes: 42100, comments: 3050, shares: 2870, video: "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4", tint: "violet" },
  { id: 6, user: "planeta.incrivel", name: "Planeta Incrível", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&h=120&fit=crop", caption: "A natureza caprichou nesse cenário. Parece até um papel de parede vivo. 🌌", song: "Natureza relaxante · áudio demo", likes: 22100, comments: 914, shares: 2430, video: "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4", tint: "sunset" },
  { id: 7, user: "sinceramente.eu", name: "Sinceramente", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&h=120&fit=crop", caption: "Eu: hoje vou dormir cedo. Também eu às 02:47: pesquisando coisas aleatórias 😂", song: "Pensamentos da madrugada · áudio demo", likes: 33700, comments: 1980, shares: 1680, video: "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4", tint: "violet" },
  { id: 8, user: "fora.do.mapa", name: "Fora do Mapa", avatar: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=120&h=120&fit=crop", caption: "Uma trilha, um horizonte infinito e zero vontade de voltar pra rotina. 🏞️", song: "Aventura pelo mundo · áudio demo", likes: 18900, comments: 667, shares: 1520, video: "https://storage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4", tint: "sunset" },
  { id: 9, user: "caos.organizado", name: "Caos Organizado", avatar: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=120&h=120&fit=crop", caption: "A confiança que eu tenho antes de abrir a câmera frontal sem querer 💀", song: "Humor sem contexto · áudio demo", likes: 29800, comments: 1420, shares: 2140, video: "https://storage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4", tint: "violet" },
  { id: 10, user: "nexora.criadores", name: "Nexora Criadores", avatar: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=120&h=120&fit=crop", caption: "Seu lembrete de hoje: você merece uma pausa e um momento bom. 💜", song: "Som original · Nexora", likes: 12840, comments: 836, shares: 294, video: "https://storage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4", tint: "sunset" },
  { id: 11, user: "perrengue.chique", name: "Perrengue Chique", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&h=120&fit=crop", caption: "Eu dizendo que vou economizar e recebendo notificação de promoção 😂💸", song: "POV da vida adulta · áudio demo", likes: 18600, comments: 930, shares: 710, video: "https://storage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4", tint: "violet" },
  { id: 12, user: "risos.em.familia", name: "Risos em Família", avatar: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=120&h=120&fit=crop", caption: "A fofoca começa com “não conta pra ninguém” e termina no grupo todo 🤐😂", song: "Comédia cotidiana · áudio demo", likes: 24700, comments: 1210, shares: 1430, video: "https://storage.googleapis.com/gtv-videos-bucket/sample/WhatCarCanYouMake.mp4", tint: "sunset" },
  { id: 13, user: "ilhas.secretas", name: "Ilhas Secretas", avatar: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=120&h=120&fit=crop", caption: "Água azul-turquesa, falésias e uma ilha que parece de outro mundo 🌊💎", song: "Rotas extraordinárias · áudio demo", likes: 31800, comments: 1050, shares: 2760, video: "https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4", tint: "violet" },
  { id: 14, user: "meu_deus_kaka", name: "Meu Deus, KKK", avatar: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=120&h=120&fit=crop", caption: "Quando você manda áudio de 3 minutos e a pessoa responde “ata” 💀", song: "Humor brasileiro · áudio demo", likes: 39700, comments: 2140, shares: 1980, video: "https://storage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4", tint: "sunset" },
  { id: 15, user: "mundo.submerso", name: "Mundo Submerso", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&h=120&fit=crop", caption: "Um universo azul escondido sob a superfície. Você teria coragem de mergulhar? 🐠", song: "Planeta azul · áudio demo", likes: 22400, comments: 812, shares: 1950, video: "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4", tint: "violet" },
  { id: 16, user: "expectativa.real", name: "Expectativa Real", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&h=120&fit=crop", caption: "Eu treinando uma pose por 20 minutos pra sair igual um RG 😂📸", song: "Expectativa x realidade · áudio demo", likes: 29100, comments: 1620, shares: 1320, video: "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4", tint: "sunset" },
  { id: 17, user: "caminhos.do.mundo", name: "Caminhos do Mundo", avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=120&h=120&fit=crop", caption: "Montanhas gigantes, trilhas estreitas e uma vista que recompensa cada passo 🏔️", song: "Diário de aventura · áudio demo", likes: 17500, comments: 603, shares: 1680, video: "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4", tint: "violet" },
  { id: 18, user: "surtos.diarios", name: "Surtos Diários", avatar: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=120&h=120&fit=crop", caption: "Minha mente às 3h da manhã lembrando de uma vergonha de 2017 😭🤡", song: "Pensamentos aleatórios · áudio demo", likes: 33200, comments: 1870, shares: 2230, video: "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4", tint: "sunset" },
  { id: 19, user: "deserto.dourado", name: "Deserto Dourado", avatar: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=120&h=120&fit=crop", caption: "Dunas infinitas mudando de cor ao pôr do sol. Parece cena de cinema 🌅", song: "Horizontes do planeta · áudio demo", likes: 20900, comments: 577, shares: 1740, video: "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4", tint: "sunset" },
  { id: 20, user: "nao_aguento_mais", name: "Não Aguento Mais 😂", avatar: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=120&h=120&fit=crop", caption: "“Vou só olhar” — eu, com 47 abas abertas e um carrinho cheio 🛒🤣", song: "Vida adulta em 15 segundos · áudio demo", likes: 27300, comments: 1490, shares: 1170, video: "https://storage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4", tint: "violet" },
  { id: 21, user: "cachoeiras.ocultas", name: "Cachoeiras Ocultas", avatar: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=120&h=120&fit=crop", caption: "Uma cachoeira escondida no meio da floresta — guardava esse lugar ou compartilhava? 🌿💦", song: "Natureza sem filtros · áudio demo", likes: 26100, comments: 840, shares: 2190, video: "https://storage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4", tint: "sunset" },
  { id: 22, user: "memes.sem.filtro", name: "Memes Sem Filtro", avatar: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=120&h=120&fit=crop", caption: "Quando a professora fala “é em dupla” e você olha pro lado em câmera lenta 😶😂", song: "Memes da escola · áudio demo", likes: 35800, comments: 2010, shares: 1880, video: "https://storage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4", tint: "violet" },
  { id: 23, user: "aurora.polar", name: "Aurora Polar", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&h=120&fit=crop", caption: "O céu dançando em tons de verde e violeta. Um espetáculo que parece impossível ✨🌌", song: "Noites extraordinárias · áudio demo", likes: 44200, comments: 1320, shares: 4920, video: "https://storage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4", tint: "violet" },
  { id: 24, user: "crise_de_risada", name: "Crise de Risada", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&h=120&fit=crop", caption: "Eu tentando explicar uma história e esquecendo o motivo no meio dela 🤦😂", song: "Humor sem roteiro · áudio demo", likes: 23900, comments: 980, shares: 920, video: "https://storage.googleapis.com/gtv-videos-bucket/sample/WhatCarCanYouMake.mp4", tint: "sunset" },
  { id: 25, user: "cidade.impossivel", name: "Cidade Impossível", avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=120&h=120&fit=crop", caption: "Ruas estreitas, arquitetura surreal e luzes que transformam a noite 🌃", song: "Explorando o desconhecido · áudio demo", likes: 19600, comments: 711, shares: 1440, video: "https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4", tint: "violet" },
  { id: 26, user: "eu_nao_fui", name: "Eu Não Fui 🤡", avatar: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=120&h=120&fit=crop", caption: "A pessoa pergunta “quem fez isso?” e todo mundo vira especialista em silêncio 😭", song: "Comédia de convivência · áudio demo", likes: 30700, comments: 1760, shares: 1510, video: "https://storage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4", tint: "sunset" },
  { id: 27, user: "oceano.secreto", name: "Oceano Secreto", avatar: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=120&h=120&fit=crop", caption: "Um recife cheio de cores e formas que parecem de outro planeta 🪸🐟", song: "Vida marinha · áudio demo", likes: 28700, comments: 901, shares: 2410, video: "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4", tint: "violet" },
  { id: 28, user: "drama_de_grupo", name: "Drama de Grupo", avatar: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=120&h=120&fit=crop", caption: "No grupo: 98 mensagens. Eu chegando depois de 2 minutos: “perdi tudo?” 😂📱", song: "Caos digital · áudio demo", likes: 36500, comments: 2280, shares: 2020, video: "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4", tint: "sunset" },
  { id: 29, user: "vale.fantastico", name: "Vale Fantástico", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&h=120&fit=crop", caption: "Um vale coberto de neblina, rios sinuosos e montanhas até onde a vista alcança 🏞️", song: "Lugares que parecem sonhos · áudio demo", likes: 23100, comments: 733, shares: 1840, video: "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4", tint: "violet" },
  { id: 30, user: "sinceridade.br", name: "Sinceridade BR", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&h=120&fit=crop", caption: "Eu falando “tô chegando” ainda procurando a outra meia 😭🧦", song: "Relatos do cotidiano · áudio demo", likes: 41200, comments: 2440, shares: 2670, video: "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4", tint: "sunset" },
  { id: 31, user: "pov.sem_filtro", name: "POV Sem Filtro", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&h=120&fit=crop", caption: "POV: você abre a geladeira pela 8ª vez esperando que tenha surgido comida nova 😂", song: "Memes do cotidiano · legenda original", likes: 18600, comments: 890, shares: 720, video: "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4", tint: "sunset" },
  { id: 32, user: "fofoca.express", name: "Fofoca Express", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&h=120&fit=crop", caption: "A pessoa: “é segredo, viu?” Eu 4 minutos depois: preciso contar uma coisa 🤐😂", song: "Fofoca em alta · legenda original", likes: 25400, comments: 1420, shares: 1680, video: "https://storage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4", tint: "violet" },
  { id: 33, user: "segunda_feira_nao", name: "Segunda-feira Não", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&h=120&fit=crop", caption: "Meu corpo acordou, mas minha alma ainda está no domingo 😭☕", song: "Humor de segunda · legenda original", likes: 32100, comments: 1900, shares: 2410, video: "https://storage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4", tint: "sunset" },
  { id: 34, user: "sinceridade_total", name: "Sinceridade Total", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&h=120&fit=crop", caption: "Eu dizendo “tanto faz” e depois julgando mentalmente todas as opções 💀", song: "Pensamentos sinceros · legenda original", likes: 21900, comments: 1080, shares: 930, video: "https://storage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4", tint: "violet" },
  { id: 35, user: "grupo_caotico", name: "Grupo Caótico", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&h=120&fit=crop", caption: "Quando você manda uma mensagem séria e respondem com figurinha KKKKK 😭", song: "Caos do grupo · legenda original", likes: 34800, comments: 2130, shares: 1870, video: "https://storage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4", tint: "sunset" },
  { id: 36, user: "sono_infinito", name: "Sono Infinito", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&h=120&fit=crop", caption: "Eu colocando cinco alarmes como se isso fosse resolver minha vida 😂⏰", song: "POV do despertador · legenda original", likes: 28700, comments: 1640, shares: 1300, video: "https://storage.googleapis.com/gtv-videos-bucket/sample/WhatCarCanYouMake.mp4", tint: "violet" },
  { id: 37, user: "quase_famoso", name: "Quase Famoso", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&h=120&fit=crop", caption: "Gravo um vídeo por 40 minutos e posto exatamente 0 segundos 🤡📱", song: "Criador em crise · legenda original", likes: 19300, comments: 980, shares: 850, video: "https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4", tint: "sunset" },
  { id: 38, user: "drama_de_novela", name: "Drama de Novela", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&h=120&fit=crop", caption: "Eu criando 17 cenários na cabeça por causa de um “ok” 😭🎭", song: "Dramas da mente · legenda original", likes: 30600, comments: 1810, shares: 2020, video: "https://storage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4", tint: "violet" },
  { id: 39, user: "economia_duvidosa", name: "Economia Duvidosa", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&h=120&fit=crop", caption: "Eu: preciso guardar dinheiro. Também eu: promoção de 12 reais 👀💸", song: "Finanças de brincadeira · legenda original", likes: 27600, comments: 1370, shares: 1490, video: "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4", tint: "sunset" },
  { id: 40, user: "turismo_surreal", name: "Turismo Surreal", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&h=120&fit=crop", caption: "POV: você encontra um lugar tão bonito que já pesquisa o preço da passagem 🌍✨", song: "Lugares incríveis · legenda original", likes: 39100, comments: 920, shares: 3250, video: "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4", tint: "violet" },
  { id: 41, user: "natureza_absurda", name: "Natureza Absurda", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&h=120&fit=crop", caption: "A natureza simplesmente acordou e decidiu humilhar todos os cenários de filme 🌿", song: "Planeta extraordinário · legenda original", likes: 33200, comments: 870, shares: 2700, video: "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4", tint: "sunset" },
  { id: 42, user: "vergonha_alheia", name: "Vergonha Alheia", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&h=120&fit=crop", caption: "Lembrando de uma coisa que falei há 6 anos bem na hora de dormir 🫠", song: "Memórias aleatórias · legenda original", likes: 36400, comments: 2070, shares: 1980, video: "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4", tint: "violet" },
  { id: 43, user: "expectativa_zero", name: "Expectativa Zero", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&h=120&fit=crop", caption: "Eu indo resolver uma coisa rapidinho e voltando com mais cinco problemas 😂", song: "Vida real · legenda original", likes: 22800, comments: 1140, shares: 1040, video: "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4", tint: "sunset" },
  { id: 44, user: "amizade_duvidosa", name: "Amizade Duvidosa", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&h=120&fit=crop", caption: "Amigo de verdade é aquele que incentiva a ideia ruim e depois ajuda a resolver 🤝🤣", song: "Amigos são assim · legenda original", likes: 41900, comments: 2460, shares: 3030, video: "https://storage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4", tint: "violet" },
  { id: 45, user: "pais_e_filhos", name: "Pais & Filhos", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&h=120&fit=crop", caption: "Minha mãe me chama pelo nome completo e eu já começo a revisar meus pecados 😭", song: "Clássicos de casa · legenda original", likes: 38800, comments: 2200, shares: 1900, video: "https://storage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4", tint: "sunset" },
  { id: 46, user: "mundo_colorido", name: "Mundo Colorido", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&h=120&fit=crop", caption: "Tem lugares que parecem ter sido pintados à mão. Qual seria sua primeira viagem? 🌈", song: "Viagem dos sonhos · legenda original", likes: 30100, comments: 760, shares: 2470, video: "https://storage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4", tint: "violet" },
  { id: 47, user: "sem_contexto", name: "Sem Contexto", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&h=120&fit=crop", caption: "Eu entrando numa conversa no meio e rindo sem saber do que estão falando 😂", song: "Humor aleatório · legenda original", likes: 24700, comments: 1510, shares: 1200, video: "https://storage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4", tint: "sunset" },
  { id: 48, user: "rotina_caotica", name: "Rotina Caótica", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&h=120&fit=crop", caption: "A lista de tarefas era pequena. Como ela virou uma missão de vida? 🫠", song: "Adulto por acidente · legenda original", likes: 21400, comments: 930, shares: 980, video: "https://storage.googleapis.com/gtv-videos-bucket/sample/WhatCarCanYouMake.mp4", tint: "violet" },
  { id: 49, user: "horizonte_aberto", name: "Horizonte Aberto", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&h=120&fit=crop", caption: "Um horizonte desses e eu cancelava todos os compromissos por uma semana 🌅", song: "Escapada virtual · legenda original", likes: 35600, comments: 810, shares: 2890, video: "https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4", tint: "sunset" },
  { id: 50, user: "nexora_em_alta", name: "Nexora em Alta", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&h=120&fit=crop", caption: "Se você chegou até o Reel 50, comenta um 💜 pra eu saber que você ficou!", song: "Comunidade Nexora · legenda original", likes: 50200, comments: 3210, shares: 4200, video: "https://storage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4", tint: "violet" }
];

demoReels.push(...extraReels);

const navItems = [
  { id: "inicio", label: "Início", icon: "home", href: "/" },
  { id: "reels", label: "Reels", icon: "reels", href: "/reels" },
  { id: "criar", label: "Criar", icon: "plus", href: "/?action=create" },
  { id: "mensagens", label: "Mensagens", icon: "messages", href: "/?tab=mensagens" },
  { id: "perfil", label: "Perfil", icon: "profile", href: "/?tab=perfil" },
];


function UiIcon({ name, size = 22 }: { name: string; size?: number }) {
  const common = { width: size, height: size, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.8, strokeLinecap: "round" as const, strokeLinejoin: "round" as const, "aria-hidden": true as const };
  const paths: Record<string, React.ReactNode> = {
    home: <><path d="m3 10 9-7 9 7"/><path d="M5 9v12h5v-7h4v7h5V9"/></>,
    reels: <><rect x="3" y="4" width="18" height="16" rx="3"/><path d="m10 8 6 4-6 4z"/><path d="m7 4 3 4M15 4l3 4"/></>,
    search: <><circle cx="10.8" cy="10.8" r="6.8"/><path d="m16 16 4.5 4.5"/></>,
    plus: <><path d="M12 5v14M5 12h14"/></>,
    messages: <><path d="M20 11.5a7.5 7.5 0 0 1-7.5 7.5H5l-2 2v-6A7.5 7.5 0 1 1 20 11.5Z"/><path d="M7.5 11.5h.01M12 11.5h.01M16.5 11.5h.01"/></>,
    profile: <><circle cx="12" cy="8" r="3.5"/><path d="M4.5 21a7.5 7.5 0 0 1 15 0"/></>,
    heart: <path d="M20.8 8.7c0 5.1-8.8 11-8.8 11s-8.8-5.9-8.8-11A4.7 4.7 0 0 1 12 6.2a4.7 4.7 0 0 1 8.8 2.5Z"/>,
    comment: <><path d="M20 11.5a7.5 7.5 0 0 1-7.5 7.5H5l-2 2v-6A7.5 7.5 0 1 1 20 11.5Z"/><path d="M8 11h8M8 14h5"/></>,
    bookmark: <path d="M6 4.5A1.5 1.5 0 0 1 7.5 3h9A1.5 1.5 0 0 1 18 4.5V21l-6-4-6 4Z"/>,
    share: <><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="m8.7 10.6 6.6-4M8.7 13.4l6.6 4"/></>,
    creator: <><path d="M12 3 14.7 8.3 21 9.2l-4.5 4.4 1.1 6.3L12 17l-5.6 2.9 1.1-6.3L3 9.2l6.3-.9Z"/></>,
    sound: <><path d="M11 5 6 9H3v6h3l5 4Z"/><path d="M15 9a5 5 0 0 1 0 6M17.5 6.5a9 9 0 0 1 0 11"/></>,
    music: <><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></>,
    chart: <><path d="M4 19V5M4 19h17"/><rect x="7" y="11" width="3" height="5" rx=".5"/><rect x="13" y="7" width="3" height="9" rx=".5"/><rect x="19" y="4" width="2" height="12" rx=".5"/></>,
    edit: <><path d="m4 16.5-.8 4.3 4.3-.8L20 7.5 16.5 4Z"/><path d="m14.8 5.7 3.5 3.5"/></>,
    close: <><path d="m6 6 12 12M18 6 6 18"/></>,
    play: <path d="m9 6 10 6-10 6z" fill="currentColor" stroke="none"/>,
    check: <path d="m5 12 4 4L19 6"/>,
  };
  return <svg {...common}>{paths[name] || paths.creator}</svg>;
}

function compactNumber(value: number) {
  return new Intl.NumberFormat("pt-BR", { notation: "compact", maximumFractionDigits: 1 }).format(value);
}

export default function ReelsPage() {
  const [language, setLanguage] = useState<NexoraLanguage>("pt-BR");
  const [publishedReels, setPublishedReels] = useState<Reel[]>([]);
  const [index, setIndex] = useState(0);
  const [liked, setLiked] = useState<Record<number, boolean>>({});
  const [saved, setSaved] = useState<Record<number, boolean>>({});
  const [reposted, setReposted] = useState<Record<number, boolean>>({});
  const [toast, setToast] = useState("");
  const [following, setFollowing] = useState<Record<string, boolean>>({});
  const [paused, setPaused] = useState(false);
  const [muted, setMuted] = useState(true);
  const [videoFailed, setVideoFailed] = useState(false);
  const [videoSourceIndex, setVideoSourceIndex] = useState(0);
  const [commentsOpen, setCommentsOpen] = useState(false);
  const [creatorTools, setCreatorTools] = useState(false);
  const [commentDraft, setCommentDraft] = useState("");
  const [comments, setComments] = useState<Record<number, string[]>>({
    1: ["Que paz esse vídeo! 💜", "Precisava ver isso hoje ✨"],
    2: ["Amei a energia!", "Mais vídeos assim, por favor 💙"],
  });
  const touchStart = useRef<{ x: number; y: number } | null>(null);
  const lastWheelMove = useRef(0);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const allReels = [...publishedReels, ...demoReels];
  const reel = allReels[Math.min(index, allReels.length - 1)];
  const availableVideoSources = reel.id === 1 ? [reel.video] : Array.from(new Set(allReels.map((item) => item.video)));
  const activeVideoSource = availableVideoSources[(index + videoSourceIndex) % availableVideoSources.length];

  useEffect(() => {
    const syncProfileReels = () => {
      try {
        const raw = window.localStorage.getItem("nexora-profile-v1");
        if (!raw) { setPublishedReels([]); return; }
        const profile = JSON.parse(raw);
        const username = typeof profile.profileUsername === "string" ? profile.profileUsername : "criador";
        const name = typeof profile.profileName === "string" ? profile.profileName : username;
        const avatar = typeof profile.avatarData === "string" && profile.avatarData ? profile.avatarData : "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&h=120&fit=crop";
        const items = Array.isArray(profile.posts) ? profile.posts : [];
        const reels = items.filter((item: any) => item && item.type === "reel" && item.mediaKind === "video" && typeof item.media === "string" && item.media.trim()).map((item: any) => ({ id: Number(item.id), user: username, name, avatar, caption: String(item.title || ""), song: String(item.song || "Som original · Nexora"), likes: Number(item.likes || 0), comments: Number(item.comments || 0), shares: Number(item.shares || 0), video: item.media, tint: "violet" })).filter((item: Reel) => Number.isFinite(item.id));
        setPublishedReels(reels);
        const likedIds: number[] = Array.isArray(profile.likedPosts) ? profile.likedPosts : [];
        const savedIds: number[] = Array.isArray(profile.savedPosts) ? profile.savedPosts : [];
        const repostedIds: string[] = Array.isArray(profile.reposted) ? profile.reposted : [];
        setLiked((current) => ({ ...current, ...Object.fromEntries(reels.map((item) => [item.id, likedIds.includes(item.id)])) }));
        setSaved((current) => ({ ...current, ...Object.fromEntries(reels.map((item) => [item.id, savedIds.includes(item.id)])) }));
        setReposted((current) => ({ ...current, ...Object.fromEntries(reels.map((item) => [item.id, repostedIds.includes(String(item.id))])) }));
        setIndex((current) => Math.min(current, reels.length + demoReels.length - 1));
      } catch { setPublishedReels([]); }
    };
    syncProfileReels();
    const syncProfileStorage = (event: StorageEvent) => { if (event.key === "nexora-profile-v1") syncProfileReels(); };
    window.addEventListener("storage", syncProfileStorage);
    window.addEventListener("focus", syncProfileReels);
    return () => { window.removeEventListener("storage", syncProfileStorage); window.removeEventListener("focus", syncProfileReels); };
  }, []);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem("nexora-comments-v1");
      let merged: Record<number, string[]> = stored ? JSON.parse(stored) : {};
      const profileRaw = window.localStorage.getItem("nexora-profile-v1");
      if (profileRaw) { const profile = JSON.parse(profileRaw); const profileComments = profile.commentsByPost || {}; for (const [id, list] of Object.entries(profileComments)) if (Array.isArray(list)) merged[Number(id)] = list as string[]; }
      setComments(current => ({ ...current, ...merged }));
    } catch { /* Mantém comentários da sessão se o armazenamento estiver indisponível. */ }
    const syncComments = (event: StorageEvent) => { if (event.key !== "nexora-comments-v1" || !event.newValue) return; try { setComments(current => ({ ...current, ...JSON.parse(event.newValue as string) })); } catch { /* Ignora dados locais inválidos. */ } };
    window.addEventListener("storage", syncComments);
    return () => window.removeEventListener("storage", syncComments);
  }, []);

  useEffect(() => {
    setLanguage(getSavedLanguage());
    const updateLanguage = () => setLanguage(getSavedLanguage());
    window.addEventListener("nexora-language-change", updateLanguage);
    window.addEventListener("storage", updateLanguage);
    return () => {
      window.removeEventListener("nexora-language-change", updateLanguage);
      window.removeEventListener("storage", updateLanguage);
    };
  }, []);

  useEffect(() => {
    setVideoFailed(false);
    setVideoSourceIndex(0);
    if (!videoRef.current) return;
    if (paused) videoRef.current.pause();
    else { videoRef.current.currentTime = 0; videoRef.current.play().catch(() => undefined); }
  }, [paused, index]);

  useEffect(() => {
    const handleKeys = (event: KeyboardEvent) => {
      if (commentsOpen || creatorTools) return;
      if (event.key === "ArrowDown" || event.key === "PageDown") { event.preventDefault(); move(1); }
      if (event.key === "ArrowUp" || event.key === "PageUp") { event.preventDefault(); move(-1); }
    };
    window.addEventListener("keydown", handleKeys);
    return () => window.removeEventListener("keydown", handleKeys);
  }, [commentsOpen, creatorTools]);

  function move(delta: number) {
    setIndex((current) => Math.max(0, Math.min(allReels.length - 1, current + delta)));
    setPaused(false);
    setCommentsOpen(false);
    setCreatorTools(false);
  }

  function syncProfileReel(action: "like" | "save" | "repost" | "comment" | "share", id: number, value?: string) {
    if (!publishedReels.some((item) => item.id === id)) return;
    try {
      const raw = window.localStorage.getItem("nexora-profile-v1");
      const profile = raw ? JSON.parse(raw) : {};
      const posts = Array.isArray(profile.posts) ? profile.posts : [];
      const post = posts.find((item: any) => Number(item.id) === id && item.type === "reel");
      if (!post) return;
      if (action === "like") { const ids: number[] = Array.isArray(profile.likedPosts) ? profile.likedPosts : []; profile.likedPosts = value === "true" ? Array.from(new Set([...ids, id])) : ids.filter((item) => item !== id); }
      if (action === "save") { const ids: number[] = Array.isArray(profile.savedPosts) ? profile.savedPosts : []; profile.savedPosts = value === "true" ? Array.from(new Set([...ids, id])) : ids.filter((item) => item !== id); }
      if (action === "repost") { const ids: string[] = Array.isArray(profile.reposted) ? profile.reposted : []; profile.reposted = value === "true" ? Array.from(new Set([...ids, String(id)])) : ids.filter((item) => item !== String(id)); }
      if (action === "comment" && typeof value === "string") { const comments = profile.commentsByPost && typeof profile.commentsByPost === "object" ? profile.commentsByPost : {}; comments[String(id)] = [...(Array.isArray(comments[String(id)]) ? comments[String(id)] : []), value]; profile.commentsByPost = comments; }
      if (action === "share") post.shares = Number(post.shares || 0) + 1;
      profile.posts = posts;
      window.localStorage.setItem("nexora-profile-v1", JSON.stringify(profile));
    } catch { /* Mantém a interação disponível mesmo se o armazenamento local falhar. */ }
  }

  function shareReel() {
    syncProfileReel("share", reel.id);
    const url = window.location.origin + "/reels#reel-" + reel.id;
    if (navigator.share) {
      navigator.share({ title: "Reels da Nexora", text: reel.caption, url }).catch(() => undefined);
    } else if (navigator.clipboard) {
      navigator.clipboard.writeText(url).then(() => alert("Link demonstrativo copiado!")).catch(() => alert(url));
    } else {
      alert(url);
    }
  }

  function submitComment(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const text = commentDraft.trim();
    if (!text) return;
    setComments((current) => { const next = { ...current, [reel.id]: [...(current[reel.id] || []), text] }; try { window.localStorage.setItem("nexora-comments-v1", JSON.stringify(next)); } catch { /* A interação permanece ativa na sessão. */ } return next; });
    syncProfileReel("comment", reel.id, text);
    setCommentDraft("");
  }

  return (
    <main className="reels-app">
      <style jsx global>{`
        * { box-sizing: border-box; }
        html, body { margin: 0; background: #05060b; color: #fff; }
        .reels-app { --cyan: #53e7ff; --purple: #9b6bff; min-height: 100dvh; height: 100dvh; overflow: hidden; background: #05060b; color: #fff; font-family: Inter, ui-sans-serif, system-ui, -apple-system, sans-serif; }
        .reels-top { position: absolute; z-index: 5; inset: env(safe-area-inset-top) 0 auto; display: flex; justify-content: space-between; align-items: center; padding: 16px 18px 12px; background: linear-gradient(#05060bd9, transparent); pointer-events: none; }
        .reels-top > * { pointer-events: auto; }
        .reels-brand { display:flex; align-items:center; gap:9px; font-size:19px; font-weight:850; letter-spacing:-.6px; }
        .reels-mark { display:grid; place-items:center; width:32px; height:32px; border-radius:11px; font-size:20px; font-weight:900; background:linear-gradient(140deg,#49e5ff,#8b65ff 60%,#e05cff); box-shadow:0 0 22px #7764ff60; }
        .reels-top-label { font-size:12px; color:#d8d8e8; border:1px solid #ffffff24; background:#10111caa; border-radius:20px; padding:8px 11px; backdrop-filter:blur(12px); }
        .reel-stage { position:relative; width:100%; height:100%; max-width:560px; margin:auto; overflow:hidden; background:#12121d; }
        .reel-video { position:absolute; inset:0; width:100%; height:100%; object-fit:cover; background:#12121d; touch-action:pan-x; }
         .reel-nature-label { position:absolute; z-index:2; top:24%; left:7%; right:20%; display:flex; flex-direction:column; gap:8px; pointer-events:none; animation:meme-pop .65s ease-out both; text-shadow:0 2px 18px #000b; }
         .reel-nature-label span { align-self:flex-start; padding:7px 10px; border:1px solid #ffffff55; border-radius:999px; background:#071a19a6; color:#baf8e4; font-size:9px; font-weight:900; letter-spacing:1.5px; backdrop-filter:blur(12px); }
         .reel-nature-label strong { max-width:310px; color:#fff; font-size:clamp(22px,6vw,34px); font-weight:850; line-height:1.06; letter-spacing:-.7px; }
        .reel-video-fallback { position:absolute; inset:0; width:100%; height:100%; object-fit:cover; background:#12121d; }
        .reel-meme-hook { position:absolute; z-index:2; top:25%; left:8%; right:18%; max-width:430px; padding:13px 15px; border:1px solid #ffffff50; border-radius:15px; background:linear-gradient(120deg,#090a14d9,#17102bd9); box-shadow:0 10px 35px #0006; color:#fff; font-size:clamp(18px,4.8vw,27px); font-weight:950; line-height:1.15; letter-spacing:-.5px; text-shadow:0 2px 12px #000b; animation:meme-pop .35s ease-out both; pointer-events:none; }
        .reel-meme-hook em { display:block; margin-bottom:7px; color:#7ceaff; font-size:9px; font-style:normal; font-weight:900; letter-spacing:1.5px; text-transform:uppercase; }
        .reel-video-error { position:absolute; inset:0; display:grid; place-content:center; gap:10px; padding:35px; text-align:center; background:radial-gradient(ellipse at 50% 40%,#28204a,#080911 72%); color:#fff; }
        .reel-video-error strong { font-size:22px; }
        .reel-video-error span { font-size:12px; line-height:1.5; color:#c9c5df; }
        .reel-meme-sticker { position:absolute; z-index:3; top:43%; right:17%; width:clamp(74px,21vw,112px); padding:4px 4px 7px; border:2px solid #fff; border-radius:14px; background:linear-gradient(135deg,#fff,#f4eaff); box-shadow:0 8px 28px #0009,0 0 18px #b75cff55; transform:rotate(5deg); pointer-events:none; animation:meme-pop .4s ease-out both; }
        .reel-meme-sticker img { display:block; width:100%; height:clamp(70px,20vw,104px); object-fit:cover; border-radius:9px; }
        .reel-meme-sticker span { display:block; padding-top:4px; text-align:center; color:#23143b; font-size:9px; font-weight:1000; letter-spacing:1px; }
        @keyframes meme-pop { from { opacity:0; transform:translateY(10px) scale(.98); } to { opacity:1; transform:translateY(0) scale(1); } }
        .reel-vignette { position:absolute; inset:0; pointer-events:none; background:linear-gradient(180deg,#0008 0%,transparent 20%,transparent 43%,#05050a24 55%,#05050be8 100%); }
        .reel-top-controls { position:absolute; top:76px; left:14px; right:14px; display:flex; justify-content:space-between; align-items:center; }
        .glass-chip { display:flex; gap:7px; align-items:center; border:1px solid #ffffff26; border-radius:99px; padding:8px 11px; color:white; background:#08091470; backdrop-filter:blur(16px); font-size:11px; font-weight:750; }
        .live-dot { width:6px; height:6px; background:#53e7ff; border-radius:50%; box-shadow:0 0 10px #53e7ff; }
        .reel-side-actions { position:absolute; right:12px; bottom:calc(94px + env(safe-area-inset-bottom)); display:flex; flex-direction:column; align-items:center; gap:17px; }
        .reel-action { border:0; background:transparent; color:white; padding:0; display:flex; flex-direction:column; align-items:center; gap:5px; min-width:46px; cursor:pointer; text-shadow:0 2px 8px #000a; }
        .reel-action-icon { width:43px; height:43px; border:1px solid #ffffff38; border-radius:16px; display:grid; place-items:center; background:#11121c78; backdrop-filter:blur(12px); font-size:23px; transition:transform .16s, background .16s; }
        .reel-action:active .reel-action-icon { transform:scale(.9); }
        .reel-action.active .reel-action-icon { color:#ff5b9a; background:#7a224b9c; border-color:#ff8ab9a0; }
        .reel-action small { font-size:10px; font-weight:800; letter-spacing:.1px; }
        .reel-disc { width:39px; height:39px; border-radius:50%; border:2px solid #fff; padding:3px; background:linear-gradient(135deg,#50e6ff,#a66aff,#ff62b0); }
        .reel-disc img { width:100%; height:100%; object-fit:cover; border-radius:50%; }
        .reel-info { position:absolute; left:16px; right:76px; bottom:calc(94px + env(safe-area-inset-bottom)); }
        .reel-author-row { display:flex; align-items:center; gap:9px; margin-bottom:11px; }
        .reel-avatar { width:38px; height:38px; border:2px solid #fff; border-radius:50%; object-fit:cover; }
        .reel-author { font-size:13px; font-weight:850; text-shadow:0 2px 8px #000; }
        .reel-follow { border:1px solid #ffffff9c; background:#ffffff12; color:#fff; padding:6px 10px; border-radius:9px; font-size:10px; font-weight:800; backdrop-filter:blur(10px); }
        .reel-caption { font-size:13px; line-height:1.5; margin:0 0 12px; text-shadow:0 2px 9px #000; display:-webkit-box; -webkit-line-clamp:3; -webkit-box-orient:vertical; overflow:hidden; }
        .reel-audio { display:flex; align-items:center; gap:8px; font-size:11px; color:#f1efff; min-width:0; }
        .reel-audio span:last-child { white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
        .reel-progress { position:absolute; bottom:calc(81px + env(safe-area-inset-bottom)); left:15px; right:15px; height:3px; background:#ffffff52; border-radius:9px; overflow:hidden; }
        .reel-progress-fill { height:100%; width:38%; background:linear-gradient(90deg,#4de6ff,#9b6bff,#f06bce); border-radius:9px; transition:width .25s ease; }
        .reels-nav { position:absolute; z-index:10; left:12px; right:12px; bottom:max(12px,env(safe-area-inset-bottom)); min-height:65px; padding:5px 11px; display:flex; justify-content:space-between; align-items:center; gap:3px; border:1.5px solid #a52bff; border-radius:999px; background:linear-gradient(110deg,rgba(29,11,44,.72),rgba(17,7,31,.66)); box-shadow:0 14px 35px #0006,0 0 20px #8c00ff18,inset 0 1px #ffffff24; backdrop-filter:blur(18px) saturate(140%); }
        .reels-nav-item { display:flex; flex:1; min-width:0; height:48px; flex-direction:column; align-items:center; justify-content:center; gap:0; text-decoration:none; color:#c5a3f5; font-size:0; font-weight:650; transition:color .18s ease, transform .18s ease; }
        .reels-nav-icon { width:100%; height:44px; display:grid; place-items:center; font-size:22px; border-radius:50%; }
        .reels-nav-icon svg { width:26px; height:26px; }
        .reels-nav-item:active { transform:scale(.94); } .reels-nav-item.active { color:#fff; }
        .reels-nav-item.active .reels-nav-icon { color:#fff; background:transparent; box-shadow:none; }
        .reels-nav-item[href="/?action=create"] { flex:0 0 52px; width:52px; height:52px; border-radius:50%; background:linear-gradient(145deg,#d42cff,#9500ff); box-shadow:0 0 22px #bd17ff55; color:#fff; }
        .reels-nav-item[href="/?action=create"] .reels-nav-icon { height:52px; }
        @media(min-width:760px){ .reels-nav{left:50%;right:auto;transform:translateX(-50%);width:min(90%,850px);min-height:76px;bottom:18px;padding:6px 18px}.reels-nav-item{height:62px}.reels-nav-icon{height:58px}.reels-nav-item[href="/?action=create"]{width:64px;height:64px;flex-basis:64px}.reels-nav-item[href="/?action=create"] .reels-nav-icon{height:64px} }
        .reels-overlay { position:absolute; z-index:20; inset:0; display:flex; align-items:flex-end; background:#0007; backdrop-filter:blur(5px); }
        .reels-sheet { width:100%; max-height:74%; overflow:auto; border-radius:24px 24px 0 0; padding:16px 17px calc(18px + env(safe-area-inset-bottom)); background:#10111c; border:1px solid #ffffff16; box-shadow:0 -15px 50px #0007; }
        .reels-sheet-head { display:flex; align-items:center; justify-content:space-between; margin-bottom:14px; font-weight:850; }
        .reels-close { border:0; color:#fff; background:#ffffff14; border-radius:50%; width:34px; height:34px; font-size:18px; }
        .reels-comment { font-size:13px; line-height:1.5; color:#e8e8f3; padding:10px 0; border-bottom:1px solid #ffffff0d; }
        .reels-comment-form { display:flex; gap:8px; margin-top:13px; }
        .reels-comment-form input { flex:1; min-width:0; border:1px solid #ffffff20; background:#070811; color:white; border-radius:13px; padding:12px; outline:none; }
        .reels-comment-form button,.reels-primary { border:0; color:#fff; background:linear-gradient(110deg,#367bff,#9754f5); padding:11px 14px; border-radius:12px; font-weight:800; }
        .reels-tools { display:grid; grid-template-columns:1fr 1fr; gap:10px; }
        .reels-tool { text-align:left; padding:13px; border:1px solid #ffffff17; border-radius:14px; background:#ffffff08; color:white; }
        .reels-tool strong { display:block; font-size:12px; margin-bottom:5px; }
        .reels-tool span { display:block; font-size:10px; color:#aaaec4; line-height:1.4; }
        .reel-center-play { position:absolute; top:48%; left:50%; transform:translate(-50%,-50%); border:1px solid #ffffff48; background:#0809149c; backdrop-filter:blur(12px); width:64px; height:64px; border-radius:50%; color:white; font-size:25px; }
        @media (min-width:700px) { .reels-app { background:radial-gradient(ellipse at 50% 35%,#211947,#05060b 65%); } .reel-stage { border-left:1px solid #ffffff12; border-right:1px solid #ffffff12; } .reels-nav { max-width:560px; left:50%; transform:translateX(-50%); border-radius:18px 18px 0 0; } }
        @media (max-height:650px) { .reel-side-actions { gap:10px; bottom:92px; } .reel-action-icon { width:36px; height:36px; border-radius:13px; } .reel-info { bottom:92px; } .reel-progress { bottom:79px; } .reel-top-controls { top:65px; } }
      `}</style>

      <header className="reels-top">
        <div className="reels-brand"><span className="reels-mark"><UiIcon name="reels" size={21} /></span><span>Nexora <span style={{ color: "#77eaff" }}>Reels</span></span></div>
        <button className="reels-top-label" onClick={() => setCreatorTools(true)}>✦ Modo criador</button>
      </header>

      <section className="reel-stage" aria-label="Visualizador de Reels"
        onWheel={(event) => { if (commentsOpen || creatorTools) return; const now = Date.now(); if (Math.abs(event.deltaY) > 35 && now - lastWheelMove.current > 520) { move(event.deltaY > 0 ? 1 : -1); lastWheelMove.current = now; } }}
        onTouchStart={(event) => { const t = event.touches[0]; touchStart.current = t ? { x: t.clientX, y: t.clientY } : null; }}
        onTouchEnd={(event) => {
          const start = touchStart.current; if (!start || commentsOpen || creatorTools) { touchStart.current = null; return; }
          const t = event.changedTouches[0]; if (!t) return;
          const dx = t.clientX - start.x; const dy = t.clientY - start.y;
          if (Math.abs(dy) > 48 && Math.abs(dy) > Math.abs(dx) * 1.2) move(dy < 0 ? 1 : -1);
          touchStart.current = null;
        }}>
        {!videoFailed ? <video key={`${reel.id}-${videoSourceIndex}`} ref={videoRef} className="reel-video" src={activeVideoSource} playsInline loop preload="auto" muted={muted} autoPlay onClick={() => setPaused((v) => !v)} onError={() => { if (videoSourceIndex < availableVideoSources.length - 1) setVideoSourceIndex((current) => current + 1); else { setVideoFailed(true); setPaused(true); } }} /> : <div className="reel-video-error"><strong>Esse vídeo não carregou 😕</strong><span>Não vamos fingir que é um vídeo mostrando uma foto. Tente passar para o próximo Reel.</span><button className="reels-primary" onClick={() => move(1)}>Próximo vídeo →</button></div>}
        {reel.id === 1 ? <div className="reel-nature-label" key="nature-reel-label"><span>✦ NATUREZA EM MOVIMENTO</span><strong>Um momento de beleza natural</strong></div> : <div className="reel-meme-hook" key={`caption-${reel.id}`}><em>POV · SITUAÇÃO REAL 😂</em>{reel.caption}</div>}
        {reel.id !== 1 && <div className="reel-meme-sticker" key={`sticker-${reel.id}`}><img src={reel.image || imageForCaption(reel.caption)} alt="Imagem temática do meme" /><span>😂 MEME</span></div>}
        <div className="reel-vignette" />
        <div className="reel-top-controls">
          <span className="glass-chip"><span className="live-dot" /> PARA VOCÊ</span>
          <button className="glass-chip" onClick={() => setMuted((v) => !v)} aria-label={muted ? "Ativar som" : "Silenciar"}><><UiIcon name="sound" size={15} /> {muted ? "Ativar som" : "Silenciar"}</></button>
        </div>
        {paused && <button className="reel-center-play" onClick={() => setPaused(false)} aria-label="Reproduzir">▶</button>}

        <aside className="reel-side-actions" aria-label="Ações do Reel">
          <button className={`reel-action ${liked[reel.id] ? "active" : ""}`} aria-label={translate(language, "like")} onClick={() => { const next = !liked[reel.id]; setLiked((v) => ({ ...v, [reel.id]: next })); syncProfileReel("like", reel.id, String(next)); }}><span className="reel-action-icon"><UiIcon name="heart" size={24} /></span><small>{compactNumber(reel.likes + (liked[reel.id] ? 1 : 0))}</small></button>
          <button className="reel-action" onClick={() => { setCommentsOpen(true); setPaused(true); }}><span className="reel-action-icon"><UiIcon name="comment" size={23} /></span><small>{compactNumber(reel.comments + Math.max(0, (comments[reel.id]?.length || 0) - 2))}</small></button>
          <button className={`reel-action ${saved[reel.id] ? "active" : ""}`} onClick={() => { const next = !saved[reel.id]; setSaved((v) => ({ ...v, [reel.id]: next })); syncProfileReel("save", reel.id, String(next)); }}><span className="reel-action-icon"><UiIcon name="bookmark" size={22} /></span><small>{saved[reel.id] ? "✓" : translate(language, "save")}</small></button>
          <button className={`reel-action ${reposted[reel.id] ? "active" : ""}`} onClick={() => { const next = !reposted[reel.id]; setReposted((v) => ({ ...v, [reel.id]: next })); syncProfileReel("repost", reel.id, String(next)); setToast(next ? "Reel adicionado às republicações do perfil." : "Republicação removida do perfil."); }} aria-label={reposted[reel.id] ? translate(language, "reposted") : translate(language, "repost")}><span className="reel-action-icon"><UiIcon name="repeat" size={22} /></span><small>{reposted[reel.id] ? translate(language, "reposted") : translate(language, "repost")}</small></button>
          <button className="reel-action" onClick={shareReel} aria-label={translate(language, "share")}><span className="reel-action-icon"><UiIcon name="share" size={22} /></span><small>{compactNumber(reel.shares)}</small></button>
          <button className="reel-action" onClick={() => setCreatorTools(true)} aria-label="Ferramentas do criador"><span className="reel-disc"><img src={reel.avatar} alt="" /></span><small>Criador</small></button>
        </aside>

        <div className="reel-info">
          <div className="reel-author-row">
            <img className="reel-avatar" src={reel.avatar} alt={reel.name} />
            <span className="reel-author">@{reel.user}</span>
            <button className="reel-follow" onClick={() => setFollowing((v) => ({ ...v, [reel.user]: !v[reel.user] }))}>{following[reel.user] ? "✓ Seguindo" : "+ Seguir"}</button>
          </div>
          <p className="reel-caption">{reel.caption}</p>
          <div className="reel-audio"><span><UiIcon name="music" size={14} /></span><span>{reel.song}</span><span>·</span><span>{index + 1}/{demoReels.length}</span></div>
        </div>
        <div className="reel-progress"><div className="reel-progress-fill" style={{ width: `${((index + 1) / demoReels.length) * 100}%` }} /></div>
      </section>

      <PrimaryNav active="reels" />

      {toast && <div role="status" style={{position:"absolute",zIndex:30,left:"50%",bottom:"calc(95px + env(safe-area-inset-bottom))",transform:"translateX(-50%)",maxWidth:"90vw",padding:"11px 15px",borderRadius:14,border:"1px solid #9b6bff88",background:"#151326ee",color:"#fff",fontSize:12,boxShadow:"0 8px 30px #0008"}} onClick={() => setToast("")}>{toast}　×</div>}


      {commentsOpen && <div className="reels-overlay" onClick={() => { setCommentsOpen(false); setPaused(false); }}>
        <section className="reels-sheet" onClick={(event) => event.stopPropagation()}>
          <div className="reels-sheet-head"><span>{translate(language, "viewComments")} <span style={{ color: "#7ceaff" }}>· {(comments[reel.id] || []).length}</span></span><button className="reels-close" onClick={() => { setCommentsOpen(false); setPaused(false); }}>×</button></div>
          {(comments[reel.id] || []).map((comment, i) => <div className="reels-comment" key={i}><strong>@comunidade</strong> {comment}</div>)}
          <form className="reels-comment-form" onSubmit={submitComment}><input value={commentDraft} onChange={(event) => setCommentDraft(event.target.value)} placeholder={translate(language, "comment")} maxLength={500} /><button type="submit">{translate(language, "send")}</button></form>
        </section>
      </div>}

      {creatorTools && <div className="reels-overlay" onClick={() => setCreatorTools(false)}>
        <section className="reels-sheet" onClick={(event) => event.stopPropagation()}>
          <div className="reels-sheet-head"><span><UiIcon name="creator" size={18} /> Central do criador</span><button className="reels-close" onClick={() => setCreatorTools(false)}>×</button></div>
          <p style={{ color: "#aeb0c5", fontSize: 12, lineHeight: 1.6, marginTop: 0 }}>Ferramentas de demonstração para organizar e acompanhar este Reel. A gestão real será conectada à conta do autor na etapa de integração.</p>
          <div className="reels-tools">
            <button className="reels-tool" onClick={() => alert("Estatísticas demonstrativas: alcance " + compactNumber(reel.likes * 4) + " · interações " + compactNumber(reel.likes + reel.comments))}><strong><UiIcon name="chart" size={16} /> Visão geral</strong><span>Alcance, interações e desempenho</span></button>
            <button className="reels-tool" onClick={() => alert("A edição estará disponível quando os Reels estiverem vinculados à sua conta.")}><strong><UiIcon name="edit" size={16} /> Editar Reel</strong><span>Legenda, capa e informações</span></button>
            <button className="reels-tool" onClick={() => alert("Preferências de comentários demonstrativas nesta versão.")}><strong><UiIcon name="comment" size={16} /> {translate(language, "comments")}</strong><span>Preferências e moderação</span></button>
            <button className="reels-tool" onClick={() => { setSaved((v) => ({ ...v, [reel.id]: !v[reel.id] })); setCreatorTools(false); }}><strong><UiIcon name="bookmark" size={16} /> {saved[reel.id] ? "Remover dos salvos" : "Guardar Reel"}</strong><span>Adicionar aos seus favoritos locais</span></button>
          </div>
        </section>
      </div>}
    </main>
  );
}
