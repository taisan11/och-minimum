import { Hono } from "hono";
import { db } from "./db";
import { eq,desc } from "drizzle-orm";
import {th, res} from "./schema";

const app = new Hono();

app.get("/", (c) => {
  return c.text("och-minimum");
});

app.get("/th", async(c) => {
    const result = await db.select().from(th)
    return c.json(result);
})
app.get("/th/:thid", async(c) => {
    const result = await db.select().from(res).where(eq(res.thid, c.req.param('thid')))
    return c.json(result);
})
app.post("/th", async(c) => {
    const now = (new Date().getTime() / 1000.0).toString()
    const body = await c.req.json();
    const thid = now;
    const name = body.name;
    const title = body.title;
    const message = body.message;
    const created = now;
    const updated = now;
    await db.insert(th).values({thid, name, title, postnum:1, created, updated});
    await db.insert(res).values({resid:thid + "1", thid, resnum:1, name, message});
    return c.text(now);
})
app.post("/th/:thid", async(c) => {
    const body = await c.req.json();
    const thid = c.req.param('thid');
    const name = body.name;
    const message = body.message;
    const resnum = await db.select().from(res).where(eq(res.thid, thid)).orderBy(desc(res.resnum)).limit(1);
    const resid = thid + (resnum[0].resnum + 1).toString();
    const created = (new Date().getTime() / 1000.0).toString();
    await db.insert(res).values({resid, thid, resnum:resnum[0].resnum + 1, name, message});
    await db.update(th).set({postnum:resnum[0].resnum + 1, updated:created}).where(eq(th.thid, thid));
    return c.text("ok");
})

export default app;