import { randomUUID } from 'node:crypto';
import { eq } from 'drizzle-orm';

import { db } from '../db';
import { comments } from '../db/schema';

export type NewCommentInput = {
  content: string;
  postId: string;
};

export async function listComments() {
  return db.select().from(comments);
}

export async function findCommentById(id: string) {
  const [comment] = await db
    .select()
    .from(comments)
    .where(eq(comments.id, id));

  return comment;
}

export async function listCommentsByPostId(postId: string) {
  return db.select().from(comments).where(eq(comments.postId, postId));
}

export async function createComment(input: NewCommentInput) {
  const [comment] = await db
    .insert(comments)
    .values({
      id: randomUUID(),
      content: input.content,
      postId: input.postId,
    })
    .returning();

  return comment;
}
