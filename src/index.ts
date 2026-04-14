import { Hono } from 'hono'

const app = new Hono()



type User = {
  id: string
  name: string
  email: string
  password: string
}

const users: User[] = []

app.get('/users', (c) => {
  return c.json(users)
})

app.get('/users/:id', (c) => {
  const id = c.req.param('id')
  const user = users.find((u) => u.id === id)

  if (!user) {
    return c.json({ message: 'User not found' }, 404)
  }

  return c.json(user)
})

app.post('/signup', async (c) => {
  const body = await c.req.json()
  const existingUser = users.find((u) => u.email === body.email)

  if (existingUser) {
    return c.json(
      { message: 'User with this email already exists' },
      409
    )
  }

  const newUser: User = {
    id: crypto.randomUUID(),
    name: body.name,
    email: body.email,
    password: body.password
  }

  users.push(newUser)

  return c.json(
    {
      message: 'User created successfully',
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email
      }
    },
    201
  )
})

app.post('/signin', async (c) => {
  const body = await c.req.json()



  const user = users.find((u) => u.email === body.email)

  if (!user || user.password !== body.password) {
    return c.json({ message: 'Invalid credentials' }, 401)
  }

  return c.json({
    message: 'Login successful',
    user: {
      id: user.id,
      name: user.name,
      email: user.email
    }
  })
})
export default app
