import express from "express";
import { handleDeleteLink, handleFetchUserLinks, handleFetchUserSingleLink, handleGenerateNewShortURL, handleRedirection } from "../controllers/url.controllers.js";
const app = express();
app.post("/create", handleGenerateNewShortURL);
app.post("/link", handleFetchUserSingleLink);
app.post("/links", handleFetchUserLinks);
app.delete("/delete", handleDeleteLink);
app.post("/redirect", handleRedirection);
export default app;
