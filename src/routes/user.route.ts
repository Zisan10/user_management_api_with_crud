import { Router } from "express";
import userController from "../controllers/user.controller";


const router = Router();


router.post('/create', userController.createUser)
router.get('/', userController.getAllUser)
router.get('/:id', userController.getSingleUser)
router.patch('/:id', userController.updateUser)
router.delete('/:id', userController.deleteUser)




export default router;

