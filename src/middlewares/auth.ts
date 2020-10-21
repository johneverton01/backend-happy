import { Request, Response, NextFunction } from 'express'
import { promisify } from "util";
import * as jwt from "jsonwebtoken";

module.exports = async(req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if(!authHeader) {
        return res.status(401).send({error: "No Token provided"});
    }

    const [scheme, token] = authHeader.split(" ");

    try {
        const decode = await promisify(jwt.verify)(token, "secret");

        req.id = decode.id;

        return next();
    }catch (err) {
        return res.status(401).send({ error: "Token invalid"});
    }
}