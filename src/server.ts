import { allocateController } from "@modules/allocate";
import express from "express";

const app = express();

app.get("/", allocateController.handle);

app.listen(3333);
