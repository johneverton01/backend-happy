import { Request, Response } from 'express';
import { getRepository } from 'typeorm';
import User from '../models/User';
import userView from '../views/users_view';
import * as Yup from 'yup';
import * as Bcrypt from "bcryptjs";
import * as jwt from "jsonwebtoken";

export default {
    async index(request: Request, response: Response) {
        const UserRepository = getRepository(User);
        const users = await UserRepository.find();
        return response.json(userView.renderMany(users));
    },

    async show(request: Request, response: Response) {
        const {id} = request.params;
        const userRepository = getRepository(User);
        const user = await userRepository.findOneOrFail(id);
        return response.json(userView.render(user));

    },

    async create(request: Request, response: Response) {
        const {
            name,
            email,
            password,
        } = request.body;

        const userRepository = getRepository(User);

        const data = {
            name,
            email,
            password: await Bcrypt.hash(password, 8),
            createdAt: Date.now()
        }

        const schema = Yup.object().shape({
            name: Yup.string().required(),
            email: Yup.string().required(),
            password: Yup.string().required(),
        });

        await schema.validate(data, {
            abortEarly: false

        });
        const user = userRepository.create(data);

        await userRepository.save(user);

        return response.status(201).json(userView.render(user));

    },

    async authenticate(request: Request, response: Response) {
        try {
            const { email, password } = request.body;
            const UserRepository = getRepository(User);
            const user = await UserRepository.findOneOrFail({email: email});
            if (!user) {
                return response.status(400).json({error: "User not found"});
            }

            if(!(await Bcrypt.compare(password, user.password))) {
                return response.status(400).json({ error: "Invalid password"});
            }

            return response.json({
                user: userView.render(user),
                token: jwt.sign({ id: user.id }, "secret", {
                    expiresIn: 86400
                  })
            });

        }catch (err) {
            return response.status(400).json({ error: "User authentication failed" });
        }

    },

    async logout(request: Request, response: Response) {
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

