import { Router } from 'express';
import { registerUser, getCurrentUser, getDataUsers, deleteInactiveUsers, modifyUserRole,obtenerUsuarios } from '../../controllers/users.controllers.js';
import { passportLocalRegister, passportAuth } from '../../middlewares/passport.js'
import{adminsOnly}from '../../middlewares/authorization.js';

export const usersRouter = Router();

usersRouter.get('/', passportAuth, adminsOnly, obtenerUsuarios);
usersRouter.post('/', passportLocalRegister, registerUser);
usersRouter.put('/modifyUserRol', passportAuth, adminsOnly, modifyUserRole);
usersRouter.get('/current', passportAuth, getCurrentUser);
usersRouter.get('/', passportAuth, adminsOnly, getDataUsers );
usersRouter.delete('/', passportAuth,adminsOnly, deleteInactiveUsers); // Nuevo endpoint para eliminar usuarios inactivos








