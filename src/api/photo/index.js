import {Router} from "express";
import passport from "passport";
import photoControler from "./controllerMogoose";


const photoRouter = new Router();
photoRouter.get("/", photoControler.get);
photoRouter.get("/:id", photoControler.getById);

export default photoRouter;