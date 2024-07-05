import { Hono } from "hono";
import { hc } from "hono/client";
import { jsxRenderer } from "hono/jsx-renderer";

const app = new Hono();
const client = hc('http://localhost:3000/api');

app.get('*', jsxRenderer(({ children, title }) => {
    return (
        <html lang="ja">
        <head>
            <meta charset="utf-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <title>{title || "aaa"}</title>
        </head>
        <body>{children}</body>
        </html>
    );
}));

app.get("/", async (c) => {
  const a = await (await fetch('http://localhost:3000/api/th')).json();
  return c.render(
    <>
    <h2>Och-minimum</h2>
    <ul>
      {await a.map((th: any) => (
        <li>
          <a href={'http://localhost:3000/ui/'+th.thid}>{th.title}</a>
        </li>
      ))}
      <form action="http://localhost:3000/ui" method="post">
        <input type="text" name="name" id="name" />
        <input type="text" name="title" id="title" />
        <textarea name="message" id="message"></textarea>
        <input type="submit" value="スレッド作成" />
      </form>
    </ul>
    </>
  );
});
app.get("/:thid", async (c) => {
    const a = await (await fetch('http://localhost:3000/api/th/'+c.req.param('thid'))).json();
    return c.render(
        <>
        {/* <h2>{a[0].title}</h2> */}
        <ul>
        {await a.map((res: any) => (
            <li>
            <p>{res.resnum}</p>
            <p>{res.name}</p>
            <p>{res.message}</p>
            </li>
        ))}
        <form action={'http://localhost:3000/ui/'+c.req.param('thid')} method="post">
        <input type="text" name="name" id="name" />
        <textarea name="message" id="message"></textarea>
        <input type="submit" value="送信" />
        </form>
        </ul>
        </>
    );
})
app.post("/:thid", async (c) => {
    const body = await c.req.formData();
    await fetch('http://localhost:3000/api/th/'+c.req.param('thid'), {
        method: 'POST',
        body: JSON.stringify({
            name: body.get('name'),
            message: body.get('message')
        }),
        headers: {
            'Content-Type': 'application/json'
        }
    });
    return c.redirect('http://localhost:3000/ui/'+c.req.param('thid'));
})
app.post("/", async (c) => {
    const body = await c.req.formData();
    const a = await fetch('http://localhost:3000/api/th', {
        method: 'POST',
        body: JSON.stringify({
            name: body.get('name'),
            title: body.get('title'),
            message: body.get('message')
        }),
        headers: {
            'Content-Type': 'application/json'
        }
    });
    return c.redirect('http://localhost:3000/ui/'+(await a.text()));
})

export default app