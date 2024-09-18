import jwt from 'jsonwebtoken';

export const userAuthenticate = (req, res, next) => {
    try {
        const token = req.cookies.token;
        if (!token) {
            console.log('Token not found');
            return res.status(401).json({ message: "Unauthorized access", success: false });
        }
        
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (!decoded) {
            console.log('Token verification failed');
            return res.status(401).json({ message: "Unauthorized access", success: false });
        }

        req.id = decoded.id;
        next();
    } catch (error) {
        console.error('Error during authentication:', error);
        return res.status(500).json({ message: "Internal server error", success: false });
    }
}