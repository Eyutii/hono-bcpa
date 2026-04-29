import { randomUUID } from 'node:crypto';
import { eq } from 'drizzle-orm';

import { db } from '../db';
import { posts } from '../db/schema';

export type NewPostInput = {
  title: string;
  content: string;
  userId: string;
};

export async function listPosts() {
  return db.select().from(posts);
}

export async function findPostById(id: string) {
  const [post] = await db.select().from(posts).where(eq(posts.id, id));

  return post;
}

export async function listPostsByUserId(userId: string) {
  return db.select().from(posts).where(eq(posts.userId, userId));
}

export async function createPost(input: NewPostInput) {
  const [post] = await db
    .insert(posts)
    .values({
      id: randomUUID(),
      title: input.title,
      content: input.content,
      userId: input.userId,
    })
    .returning();

  return post;
}
