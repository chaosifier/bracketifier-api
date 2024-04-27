import express, { json } from "express";
import { signin_user_handler, signup_user_handler } from "./users.handlers";
import { verifyToken } from "./users.middleware";
// import lectureRouter from '../lecture/lecture.routes.lecture';

const userRouter = express.Router();

/**
 * @swagger
 * /users:
 *   post:
 *     summary: Create a user
 *     tags:
 *       - Users
 *     description: Add new user to the database.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: object
 *                 properties:
 *                   first:
 *                     type: string
 *                     description: First name of the user
 *                   last:
 *                     type: string
 *                     description: Last name of the user
 *                 required:
 *                   - first
 *                   - last
 *               email:
 *                 type: string
 *                 description: The email of the user.
 *               phone:
 *                 type: string
 *                 description: The phone of the user.
 *               password:
 *                 type: string
 *                 description: The password of the user.
 *             required:
 *               - name
 *               - email
 *               - phone
 *               - password
 *     responses:
 *       200:
 *         description: Newly created user's Id.
 *       500:
 *         description: Internal server error.
 */
userRouter.post("/signup", json(), signup_user_handler);
userRouter.post("/signin", json(), signin_user_handler);

export default userRouter;
