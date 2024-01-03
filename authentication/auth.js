import HttpStatusCode from '../exceptions/HttpStatusCode.js'
import jwt from 'jsonwebtoken'

export default function checkToken(req, res, next) {
    const unauthenticatedUrls = [
        '/users/login',
        '/users/register',
    ];

    const imagePattern = /^\/(products|category)\/image\/[a-zA-Z0-9]+$/;

    if (unauthenticatedUrls.includes(req.url.toLowerCase().trim())) {
        next();
        return;
    }

    if (imagePattern.test(req.url)) {
        next();
        return;
    }

    const token = req.headers?.authorization?.split(" ")[1];
    try {
        const jwtObject = jwt.verify(token, process.env.JWT_SECRET);
        const isExpired = Date.now() >= jwtObject.exp * 1000;

        if (isExpired) {
            res.status(HttpStatusCode.BAD_REQUEST).json({
                message: 'Token is expired'
            });
            res.end();
        } else {
            next();
        }
    } catch (exception) {
        res.status(HttpStatusCode.BAD_REQUEST).json({
            message: exception.message
        });
    }
}
