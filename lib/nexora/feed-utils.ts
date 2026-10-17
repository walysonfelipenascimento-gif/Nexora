import type { FeedMode, Post, ProfileStats } from "./types";

export function normalizeSearchText(value: string): string {
  return value.trim().toLocaleLowerCase("pt-BR");
}

export function filterFeedPosts(
  posts: Post[],
  searchQuery: string,
  mode: FeedMode,
  followedUsers: string[],
): Post[] {
  const query = normalizeSearchText(searchQuery);
  return posts.filter((post) => {
    const searchableText = normalizeSearchText(
      `${post.name} ${post.username} ${post.caption} ${post.location}`,
    );
    const matchesSearch = !query || searchableText.includes(query);
    const matchesMode =
      mode === "for-you" || post.isOwn || followedUsers.includes(post.username);
    return matchesSearch && matchesMode;
  });
}

export function toggleListItem<T>(items: T[], item: T): T[] {
  return items.includes(item)
    ? items.filter((current) => current !== item)
    : [...items, item];
}

export function calculateProfileStats(
  posts: Post[],
  followedUsers: string[],
  savedPostIds: Array<string | number>,
): ProfileStats {
  return {
    ownPosts: posts.filter((post) => post.isOwn).length,
    following: followedUsers.length,
    saved: savedPostIds.length,
    feedLikes: posts.reduce((total, post) => total + post.likes, 0),
  };
}
