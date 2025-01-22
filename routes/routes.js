import express from "express";
import { checkStatus, getMemberId } from "../services/member.js";

const router = express.Router();

router.post("/validate", getMemberId);
router.get("/status", checkStatus);

export default router;
