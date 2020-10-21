import { Router } from 'express';
import multer from 'multer';
import uploadConfig from './config/upload';
import OrphanagesController from './controllers/OrphanagesController';
import UserController from './controllers/UsersController';
import authMiddleware from './middlewares/auth';
const routes = Router();
const upload = multer(uploadConfig);

routes.post('/login', UserController.authenticate);
routes.post('/users', UserController.create);
routes.get('/orphanages', OrphanagesController.index);
routes.get('/orphanages/:id', OrphanagesController.show);
routes.use(authMiddleware);
routes.post('/orphanages', upload.array('images'), OrphanagesController.create);
routes.put('/orphanages/update/:id', upload.array('images'), OrphanagesController.update);
routes.delete('/orphanages/delete/:id', OrphanagesController.delete);

routes.get('/users', UserController.index);
routes.get('/users/:id', UserController.show);



routes.post('/logout', UserController.logout);

export default routes;