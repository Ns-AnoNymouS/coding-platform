import express from 'express';
import { verifyToken, adminOnly } from '../middlewares/login-middleware.js';

import {
    addTestCase, editTestCase, getPendingTestCaseById,
    getPendingTestCase, addPendingTestCase
} from "../controllers/test-case-controller.js";


const router = express.Router();

router.post("/add-test-case", verifyToken, addTestCase);
router.post("/edit-testcase", verifyToken, adminOnly, editTestCase);
router.get("/get-pending-testcases", verifyToken, adminOnly, getPendingTestCase);
router.get("/pending-testcases/:testcaseID", verifyToken, adminOnly, getPendingTestCase);
router.post("/add-pending-test-case", verifyToken, adminOnly, addPendingTestCase);

export default router;