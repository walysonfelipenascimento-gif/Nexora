import type { Post, Story } from "./types";

export const stories: Story[] = [
  {
    name: "Seu story",
    image: "",
    own: true,
  },
  {
    name: "mariana",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=160&h=160&fit=crop",
  },
  {
    name: "gabriel",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=160&h=160&fit=crop",
  },
  {
    name: "isabela",
    image: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=160&h=160&fit=crop",
  },
  {
    name: "lucas",
    image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=160&h=160&fit=crop",
  },
  {
    name: "ana",
    image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=160&h=160&fit=crop",
  },
];

export const initialPosts: Post[] = [
  {
    id: 1,
    name: "Mariana Costa",
    username: "marianacosta",
    avatar:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&h=120&fit=crop",
    image:
      "https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?w=900&h=1100&fit=crop",
    location: "Recife, PE",
    caption:
      "Às vezes, tudo o que a gente precisa é desacelerar e aproveitar o caminho. ✨",
    likes: 248,
    liked: false,
    comments: [
      "Que lugar lindo! 💙",
      "A energia dessa foto é incrível!",
    ],
  },
  {
    id: 2,
    name: "Gabriel Oliveira",
    username: "gabrieloliveira",
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&h=120&fit=crop",
    image:
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=900&h=1100&fit=crop",
    location: "Brasil",
    caption:
      "Colecionando momentos, conhecendo pessoas e criando novas oportunidades. 🌎",
    likes: 126,
    liked: false,
    comments: ["Fotografia maravilhosa! 🔥"],
  },
];

export const navigation = [
  { id: "inicio", label: "Início", icon: "⌂" },
  { id: "explorar", label: "Explorar", icon: "⌕" },
  { id: "criar", label: "Criar", icon: "+" },
  { id: "curtidas", label: "Curtidas", icon: "♡" },
  { id: "perfil", label: "Perfil", icon: "○" },
];
