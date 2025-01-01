import {Router} from 'express'
import {logoutUser, loginUser, registerUser,refreshAccessToken} from '../controllers/users.controller.js';
import { verifyJWT } from '../middlewares/authorization.middlewares.js';
const router =Router()
router.route("/register").post(
      
      registerUser)
router.route("/login").post(loginUser)
router.route("/logout").post(verifyJWT,logoutUser)
router.route("/refresh-token").post(refreshAccessToken)
export default router 