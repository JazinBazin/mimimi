const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const jsonParser = express.json();
const app = express();
const appRoot = require('app-root-path');

const articleSchema = new Schema(
    {
        headline: {
            type: String,
            required: true,
            maxlength: 100
        },
        text: {
            type: String,
            required: true,
            maxlength: 5000
        },
    },
    { versionKey: false });

const Article = mongoose.model('Article', articleSchema);

mongoose.connect(
    "mongodb://localhost:27017/test",
    {
        useNewUrlParser: true,
        useCreateIndex: true,
        useUnifiedTopology: true,
        useFindAndModify: false
    })
    .then(() => {
        app.listen(3000, () => {
            console.log("Server has started.");
        });
    })
    .catch(error => console.log(error));


app.use((req, res, next) => {
    res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
    res.setHeader("Pragma", "no-cache");
    res.setHeader("Expires", "0");
    next();
});

app.get("/api/articles", (req, res) => {
    const range = JSON.parse(req.query.range);
    Article.find({})
        .then(articles => {
            const rangeEnd = min(range[1], articles.length);
            const contentRange = `articles ${range[0]}-${rangeEnd}/${articles.length}`;
            res.setHeader("Content-Range", contentRange);
            articlesToSend = [];
            articles.map(article => {
                articlesToSend.push({
                    id: article._id,
                    headline,
                    text
                });
            });
            res.json(articlesToSend);
        })
        .catch(error => console.log("error"));
});

app.use('/dist', express.static(path.join(appRoot.path, "/dist/")));

app.get("/*", (req, res) => {
    res.sendFile((path.join(appRoot.path, "/public/index.html")));
});
