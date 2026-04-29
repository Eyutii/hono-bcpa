import { Hono } from 'hono';

import { listCommentsByPostId } from '../services/comment.service';
import {
  createPost,
  findPostById,
  listPosts,
  listPostsByUserId,
} from '../services/post.service';
import { findUserById } from '../services/user.service';

export const postRoutes = new Hono();

postRoutes.get('/posts', async (c) => {
  const posts = await listPosts();
  return c.json(posts);
});

postRoutes.get('/posts/:id', async (c) => {
  const post = await findPostById(c.req.param('id'));

  if (!post) {
    return c.json({ message: 'Post not found' }, 404);
  }

  return c.json(post);
});

postRoutes.post('/posts', async (c) => {
  const body = await c.req.json();

  if (!body.title || !body.content || !body.userId) {
    return c.json({ message: 'title, content, and userId are required' }, 400);
  }

  const user = await findUserById(body.userId);

  if (!user) {
    return c.json({ message: 'User not found' }, 404);
  }

  const post = await createPost({
    title: body.title,
    content: body.content,
    userId: body.userId,
  });

  return c.json({ message: 'Post created successfully', post }, 201);
});

postRoutes.get('/users/:userId/posts', async (c) => {
  const userId = c.req.param('userId');
  const user = await findUserById(userId);

  if (!user) {
    return c.json({ message: 'User not found' }, 404);
  }

  const posts = await listPostsByUserId(userId);
  return c.json(posts);
});

postRoutes.get('/posts/:postId/comments', async (c) => {
  const postId = c.req.param('postId');
  const post = await findPostById(postId);

  if (!post) {
    return c.json({ message: 'Post not found' }, 404);
  }

  const comments = await listCommentsByPostId(postId);
  return c.json(comments);
});
