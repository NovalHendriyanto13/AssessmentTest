import express from "express";
import * as birthdayController from '../../app/controllers/api/birthday.controller';

const route = express.Router();

route.get('/send-email/:id', birthdayController.checkBirthday);

route.get('/', birthdayController.list);
route.post('/', birthdayController.create);
route.get('/:id', birthdayController.detail);
route.put('/:id', birthdayController.update);
route.delete('/:id', birthdayController.remove);

export default route;