import express from "express";
const app = express();

app.get("/", (req, res) => {
    res.send("hello");
});

app.get("/", (req, res) => {
    res.send("hello");
});

app.get("/api", (req, res) => {
    res.send("hello");
});

app.post("/api/authenticate", (req, res) => {
    res.send("hello");
});

app.post("/api/create", (req, res) => {
    res.send("hello");
});

app.post("/api/update", (req, res) => {
    res.send("hello");
});

app.post("/api/delete", (req, res) => {
    res.send("hello");
});

app.post("/api/list", (req, res) => {
    res.send("hello");
});

app.listen(3000);
