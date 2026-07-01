import jwt from "jsonwebtoken";

const getToken = (req) => {
    if (req.cookies?.token) return req.cookies.token;

    const h = req.headers.authorization;

    if (typeof h === "string" && h.startsWith("Bearer ")) {
        return h.slice(7).trim();
    }

    return null;
};

const isAuth = (req, res, next) => {
    try {

        const token = getToken(req);

        if (!token) {
            return res.status(401).json({
                message: "user does not have token"
            });
        }

        const verifiedToken = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        req.userId = verifiedToken.userId;

        next();

    } catch (err) {

        return res.status(401).json({
            message: `is Auth error: ${err.message}`
        });

    }
};

export default isAuth;