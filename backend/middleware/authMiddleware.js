import jwt from 'jsonwebtoken'
import User from '../models/User.js';
export const protect = async(req,res,next) =>{
    try {
        let token;
        if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
            token = req.headers.authorization.split(' ')[1];
        }
        if(!token){
            return res.status(401).json({
                success:false,
                message: "Not authorized. No token provided"
            })
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id).select('-password')

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "User not found"
            });
        }

        if (!user.isActive) {
            return res.status(403).json({
                success: false,
                message: "Your account has been deactivated"
            });
        }

        req.user = user;
        next();

    } catch (error) {
        console.error("Auth Middleware Error:", error);
        return res.status(401).json({
            success: false,
            message: "Invalid or expired token"
        });
    }

}
    
export const restrictTo = (...roles) =>{
    return (req, res, next) =>{
        if(!roles.includes(req.user.role)){
            return res.status(403).json({
                success: false,
                message: "You do not have permission to perform this action"
            });
        }
        next();
    }
}

export default {protect, restrictTo}