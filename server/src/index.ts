import express from "express";
import * as APITypes from "./APITypes";
import * as DB from "./DB";
import { authenticate } from "./authenticate";

const app = express();
app.use(express.json());

app.get("/", (req, res) => {
    res.send("hello");
});

app.get("/api", (req, res) => {
    res.send("hello");
});

app.post("/api/createAccount", (req, res) => {
    res.send("hello");
});

app.post("/api/authenticate", (req, res) => {
    res.send("hello");
});

app.post("/api/create", async (req, res) => {
    if (!APITypes.isCreateBody(req.body)) {
        res.status(400);
        res.send({ error: "Request could not be understood" });
        return;
    }

    // const jwt = authenticate(req.headers["authorization"]);
    // if (!jwt) {
    //     res.status(401);
    //     res.send({ error: "Request could not be authenticated" });
    //     return;
    // }

    // const dbQuery = await DB.createEntry(jwt.id, req.body.entry);
    const dbQuery = await DB.createEntry(1, req.body.entry);
    if (dbQuery.error) {
        res.status(500);
        res.send({ error: dbQuery.error });
        return;
    }

    res.status(200);
    res.send({ error: null });
});

app.post("/api/createText", async (req, res) => {
    if (!APITypes.isCreateTextBody(req.body)) {
        res.status(400);
        res.send({ error: "Request could not be understood" });
        return;
    }

    const dbQuery = await DB.createTextEntry(1, req.body.entry);
    if (dbQuery.error) {
        res.status(500);
        res.send({ error: dbQuery.error });
        return;
    }

    res.status(200);
    res.send({ error: null });
});

app.post("/api/update", async (req, res) => {
    if (!APITypes.isUpdateBody(req.body)) {
        res.status(400);
        res.send({ error: "Request could not be understood" });
        return;
    }

    // const jwt = authenticate(req.headers["authorization"]);
    // if (!jwt) {
    //     res.status(401);
    //     res.send({ error: "Request could not be authenticated" });
    //     return;
    // }

    // const dbQuery = await DB.updateEntry(jwt.id, req.body.entry);
    const dbQuery = await DB.updateEntry(1, req.body.entry);
    if (dbQuery.error) {
        res.status(500);
        res.send({ error: dbQuery.error });
        return;
    }

    res.status(200);
    res.send({error: null});
});

app.post("/api/updateText", async (req, res) => {
    if (!APITypes.isTextEntry(req.body.entry)) {
        res.status(400);
        res.send({ error: "Request could not be understood" });
        return;
    }

    const dbQuery = await DB.updateTextEntry(1, req.body.entry);
    if (dbQuery.error) {
        res.status(500);
        res.send({ error: dbQuery.error });
        return;
    }

    res.status(200);
    res.send({ error: null });
});

app.post("/api/delete", async (req, res) => {
    if (!APITypes.isDeleteBody(req.body)) {
        res.status(400);
        res.send({ error: "Request could not be understood" });
        return;
    }

    // const jwt = authenticate(req.headers["authorization"]);
    // if (!jwt) {
    //     res.status(401);
    //     res.send({ error: "Request could not be authenticated" });
    //     return;
    // }

    // const dbQuery = await DB.deleteEntry(jwt.id, req.body.id);
    const dbQuery = await DB.deleteEntry(1, req.body.id);
    if (dbQuery.error) {
        res.status(500);
        res.send({ error: dbQuery.error });
        return;
    }

    res.status(200);
    res.send({ error: null });
});

app.post("/api/deleteText", async (req, res) => {
    if (!APITypes.isDeleteBody(req.body)) {
        res.status(400);
        res.send({ error: "Request could not be understood" });
        return;
    }

    // const jwt = authenticate(req.headers["authorization"]);
    // if (!jwt) {
    //     res.status(401);
    //     res.send({ error: "Request could not be authenticated" });
    //     return;
    // }

    // const dbQuery = await DB.deleteEntry(jwt.id, req.body.id);
    const dbQuery = await DB.deleteTextEntry(1, req.body.id);
    if (dbQuery.error) {
        res.status(500);
        res.send({ error: dbQuery.error });
        return;
    }

    res.status(200);
    res.send({ error: null });
})

app.post("/api/listByIDs", async (req, res) => {
    if (!APITypes.isListByIDsBody(req.body)) {
        res.status(400);
        res.send({ error: "Request could not be understood" });
        return;
    }

    const dbQuery = await DB.getEntryByIDs(1, req.body.ids);
    if (dbQuery.error) {
        res.status(500);
        res.send({ error: dbQuery.error });
        return;
    }

    res.status(200);
    res.send({ error: null, entries: dbQuery.results });
})

app.post("/api/listTextByIDs", async (req, res) => {
    if (!APITypes.isListByIDsBody(req.body)) {
        res.status(400);
        res.send({ error: "Request could not be understood" });
        return;
    }

    const dbQuery = await DB.getTextEntryByIDs(1, req.body.ids);
    if (dbQuery.error) {
        res.status(500);
        res.send({ error: dbQuery.error });
        return;
    }

    res.status(200);
    res.send({ error: null, entries: dbQuery.results });
})

app.post("/api/list", async (req, res) => {
    if (!APITypes.isListModifiedBody(req.body)) {
        res.status(400);
        res.send({ error: "Request could not be understood" });
        return;
    }

    const dbQuery = await DB.getModifiedEntry(1, req.body);
    if (dbQuery.error) {
        res.status(500);
        res.send({ error: dbQuery.error });
        return;
    }

    const resultCount = dbQuery.results.length;
    let offset: null | number = null;
    if (resultCount === req.body.limit) {
        offset = (req.body.offset ?? 0) + resultCount;
    }

    const entry = dbQuery.results.map(item => {
        delete item.user_id;
        return item;
    });

    const response = {
        error: null,
        total: dbQuery.results.length,
        offset,
        entry
    };

    res.status(200);
    res.send(response);
});

app.post("/api/resolveSync", async (req, res) => {
    if (!APITypes.isResolveSyncBody(req.body)) {
        res.status(400);
        res.send({ error: "Request could not be understood" });
        return;
    }

    const resolve = await DB.resolveSync(1, req.body.entries, req.body.mode);

    res.status(200);
    res.send(resolve);
});

app.listen(3000);
