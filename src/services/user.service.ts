import { randomUUID } from 'node:crypto';
import { eq } from 'drizzle-orm';

import { db } from '../db';
import { users } from '../db/schema';

export type NewUserInput = {
  name: string;
  email: string;
  password: string;
};

export type SignInInput = {
  email: string;
  password: string;
};

export const publicUserColumns = {
  id: users.id,
  name: users.name,
  email: users.email,
};

export async function listUsers() {
  return db.select(publicUserColumns).from(users);
}

export async function findUserById(id: string) {
  const [user] = await db
    .select(publicUserColumns)
    .from(users)
    .where(eq(users.id, id));

  return user;
}

export async function findUserByEmail(email: string) {
  const [user] = await db.select().from(users).where(eq(users.email, email));

  return user;
}

export async function createUser(input: NewUserInput) {
  const [user] = await db
    .insert(users)
    .values({
      id: randomUUID(),
      name: input.name,
      email: input.email,
      password: input.password,
    })
    .returning(publicUserColumns);

  return user;
}

export async function authenticateUser(input: SignInInput) {
  const user = await findUserByEmail(input.email);

  if (!user || user.password !== input.password) {
    return null;
  }

  const { password: _password, ...publicUser } = user;
  return publicUser;
}
