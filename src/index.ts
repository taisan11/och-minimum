import { Hono } from 'hono'
import api from './api'
import ui from './ui'

const app = new Hono()

app.get('/', (c) => {
  return c.text('Hello Hono!')
})

app.route('/api', api)
app.route('/ui', ui)

export default app
