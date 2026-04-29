import { Hono } from 'hono';

import {
  createComment,
  findCommentById,
  listComments,
} from '../services/comment.service';
import { findPostById } from '../services/post.service';

export const commentRoutes = new Hono();

commentRoutes.get('/comments', async (c) => {
  const comments = await listComments();
  return c.json(comments);
});

commentRoutes.get('/comments/:id', async (c) => {
  const comment = await findCommentById(c.req.param('id'));

  if (!comment) {
    return c.json({ message: 'Comment not found' }, 404);
  }

  return c.json(comment);
});

commentRoutes.post('/comments', async (c) => {
  const body = await c.req.json();

  if (!body.content || !body.postId) {
    return c.json({ message: 'content and postId are required' }, 400);
  }

  const post = await findPostById(body.postId);

  if (!post) {
    return c.json({ message: 'Post not found' }, 404);
  }

  const comment = await createComment({
    content: body.content,
    postId: body.postId,
  });

  return c.json({ message: 'Comment created successfully', comment }, 201);
});
