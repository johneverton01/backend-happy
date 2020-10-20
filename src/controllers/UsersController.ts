import { Request, Response } from 'express';
import { getRepository } from 'typeorm';
import User from '../models/User';
import userView from '../views/users_view';
import authMiddleware from '../middlewares/auth';
import * as Yup from 'yup';
import * as Bcrypt from "bcryptjs";

export default {
    async index(request: Request, response: Response) {
        const UserRepository = getRepository(User);
        const users = await UserRepository.find();
        return response.json(userView.renderMany(users));
    },

    async show(request: Request, response: Response) {

    },

    async create(request: Request, response: Response) {
        const {
            name,
            email,
            password,
        } = request.body;

        const UserRepository = getRepository(User);

        const data = {
            name,
            email,
            password: await Bcrypt.hash(password, 8) ,
            createdAt: Date.now
        }

    },

    async authenticate(request: Request, response: Response) {
        try {
            const { email, password } = request.body;
            const UserRepository = getRepository(User);
            const user = await UserRepository.findOne(email);

            if (!user) {
                return response.status(400).json({error: "User not found"});
            }

            if(!(await Bcrypt.compare(user.password, await Bcrypt.hash(password, 8)))) {
                return response.status(400).json({ error: "Invalid password"});
            }

            return response.json({
                user,
                token: user
            });

        }catch (err) {
            return response.status(400).json({ error: "User authentication failed" });
        }

    }


}

