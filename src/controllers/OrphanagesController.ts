import { Request, Response, NextFunction } from 'express';
import { getRepository, getConnection } from 'typeorm';
import Orphanage from '../models/Orphanage';
import orphanageView from '../views/orphanages_view';
import * as Yup from 'yup';

export default {
    async index(request: Request, response: Response, next: NextFunction) {
        const {status} = request.params
        const orphanagesRepository = getRepository(Orphanage);
        if(status){
            const orphanages = await orphanagesRepository.createQueryBuilder("orphanages").where("status = :status", {status}).getMany();
            return response.json(orphanages);
        }
        const orphanages = await orphanagesRepository.find({
            relations: ['images']
        });

        return response.json(orphanageView.renderMany(orphanages));
    },

    async show(request: Request, response: Response) {
        const {id} = request.params;
        const orphanagesRepository = getRepository(Orphanage);
        const orphanage = await orphanagesRepository.findOneOrFail(id, {
            relations: ['images']
        });
        return response.json(orphanageView.render(orphanage));
    },

    async create(request: Request, response: Response) {
        const{
            name,
            latitude,
            longitude,
            about,
            instructions,
            opening_hours,
            open_on_weekends,
            contact,
        } = request.body;

        const orphanagesRepository = getRepository(Orphanage);
        const requestImages = request.files as Express.Multer.File[];
        const images = requestImages.map(image => {
            return { path: image.filename }
        });

        const data = {
            name,
            latitude,
            longitude,
            about,
            instructions,
            opening_hours,
            open_on_weekends: open_on_weekends === 'true',
            contact,
            status: false,
            images
        };

        const schema = Yup.object().shape({
            name: Yup.string().required(),
            latitude: Yup.number().required(),
            longitude: Yup.number().required(),
            about: Yup.string().required().max(300),
            instructions: Yup.string().required(),
            opening_hours: Yup.string().required(),
            open_on_weekends: Yup.boolean().required(),
            contact: Yup.string().required(),
            status: Yup.boolean().required(),
            images: Yup.array(
                Yup.object().shape({
                    path: Yup.string().required()
                })
            )
        });

        await schema.validate(data, {
            abortEarly: false
        });

        const orphanage =  orphanagesRepository.create(data);

        await orphanagesRepository.save(orphanage);

        return response.status(201).json(orphanage);
    },

    async update(request: Request, response: Response) {
        const {id} = request.params;
        const{
            name,
            latitude,
            longitude,
            about,
            instructions,
            opening_hours,
            open_on_weekends,
            contact,
            status,
        } = request.body;

        const orphanagesRepository = getRepository(Orphanage);
        const requestImages = request.files as Express.Multer.File[];
        const images = requestImages.map(image => {
            return {
                path: image.filename,
             }
        });

        const data = {
            id: parseInt(id),
            name,
            latitude,
            longitude,
            about,
            instructions,
            opening_hours,
            open_on_weekends: open_on_weekends === 'true',
            contact,
            status: status === 'true',
        };


        const schema = Yup.object().shape({
            id: Yup.number().required(),
            name: Yup.string().required(),
            latitude: Yup.number().required(),
            longitude: Yup.number().required(),
            about: Yup.string().required().max(300),
            instructions: Yup.string().required(),
            opening_hours: Yup.string().required(),
            open_on_weekends: Yup.boolean().required(),
            contact: Yup.string().required(),
            status: Yup.boolean().required(),
            images: Yup.array(
                Yup.object().shape({
                    path: Yup.string().required(),
                    orphanage_id: Yup.number().required(),
                })
            )
        });


        await schema.validate(data, {
            abortEarly: false
        });

        const orphanage =  orphanagesRepository.create(data);

        await orphanagesRepository.save(orphanage);

        return response.status(200).json(orphanageView.render(orphanage));

    },

    async delete(request: Request, response: Response) {
        const {id} = request.params;
        const orphanagesRepository = getRepository(Orphanage);
        await orphanagesRepository.delete(id);
        return response.status(200).json({ message: 'Orphanage deleted'});
    },
};