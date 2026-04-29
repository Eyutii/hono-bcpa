import { Hono } from 'hono';

import { commentRoutes } from './routes/comment.routes';
import { postRoutes } from './routes/post.routes';
import { userRoutes } from './routes/user.routes';

const app = new Hono();

app.route('/', userRoutes);
app.route('/', postRoutes);
app.route('/', commentRoutes);

export default app;
