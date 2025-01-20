import express from "express";
import { getMemberId } from "../services/member.js";

const router = express.Router();

router.post("/validate", getMemberId);

export default router;
