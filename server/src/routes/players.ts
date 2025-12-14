import { Router } from "express";
import { getBasicGameLog, getGameLog, getPlayerById, getPlayerByName, getPlayerNextGame, getPlayerTeam } from "../controllers/players";

const router = Router();

router.get("/nextgames", getPlayerNextGame);
router.get("/gamelog", getGameLog);
router.get("/:id", getPlayerById);
router.get("/team/:id", getPlayerTeam);
router.get("/name/:name", getPlayerByName);


export default router;