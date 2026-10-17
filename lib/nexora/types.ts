export type Story = {
  name: string;
  image: string;
  own?: boolean;
};

export type Post = {
  id: string | number;
  name: string;
  username: string;
  avatar: string;
  image: string;
  location: string;
  caption: string;
  likes: number;
  liked: boolean;
  comments: string[];
  isOwn?: boolean;
};

export type FeedMode = "for-you" | "following";
export type ProfileStats = {
  ownPosts: number;
  following: number;
  saved: number;
  feedLikes: number;
};
