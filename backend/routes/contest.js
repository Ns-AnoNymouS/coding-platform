import multer from 'multer';
import express from 'express';
import path from 'path';
import fs from 'fs';

import { verifyToken, adminOnly, checkToken } from '../middlewares/login-middleware.js';
import {
    createContest, getContest, createContestQuestion,
    getContestQuestions, getContestQuestionsById, registerContest
} from '../controllers/contest-controller.js';

const router = express.Router();

const uploadDir = path.join(path.resolve(), 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Specify the destination directory
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`); // Name the file uniquely
    },
});

const upload = multer({ storage: storage });

router.get("/all-contest", checkToken, getContest);
router.post("/create-contest", verifyToken, createContest);
router.post("/register-contest", verifyToken, registerContest);
router.post("/create-contest-problem", upload.single('file'), verifyToken, createContestQuestion);

export default router;
