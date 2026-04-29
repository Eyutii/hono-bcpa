import { Hono } from 'hono';

import {
  authenticateUser,
  createUser,
  findUserByEmail,
  findUserById,
  listUsers,
} from '../services/user.service';

export const userRoutes = new Hono();

userRoutes.get('/users', async (c) => {
  const users = await listUsers();
  return c.json(users);
});

userRoutes.get('/users/:id', async (c) => {
  const user = await findUserById(c.req.param('id'));

  if (!user) {
    return c.json({ message: 'User not found' }, 404);
  }

  return c.json(user);
});

userRoutes.post('/users', async (c) => {
  const body = await c.req.json();

  if (!body.name || !body.email || !body.password) {
    return c.json({ message: 'name, email, and password are required' }, 400);
  }

  const existingUser = await findUserByEmail(body.email);

  if (existingUser) {
    return c.json({ message: 'User with this email already exists' }, 409);
  }

  const user = await createUser({
    name: body.name,
    email: body.email,
    password: body.password,
  });

  return c.json({ message: 'User created successfully', user }, 201);
});

userRoutes.post('/signup', async (c) => {
  const body = await c.req.json();

  if (!body.name || !body.email || !body.password) {
    return c.json({ message: 'name, email, and password are required' }, 400);
  }

  const existingUser = await findUserByEmail(body.email);

  if (existingUser) {
    return c.json({ message: 'User with this email already exists' }, 409);
  }

  const user = await createUser({
    name: body.name,
    email: body.email,
    password: body.password,
  });

  return c.json({ message: 'User created successfully', user }, 201);
});

userRoutes.post('/signin', async (c) => {
  const body = await c.req.json();

  if (!body.email || !body.password) {
    return c.json({ message: 'email and password are required' }, 400);
  }

  const user = await authenticateUser({
    email: body.email,
    password: body.password,
  });

  if (!user) {
    return c.json({ message: 'Invalid credentials' }, 401);
  }

  return c.json({ message: 'Login successful', user });
});
