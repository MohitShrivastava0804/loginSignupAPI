
// auth, isUser, isTutor, isAdmin

const jwt = require("jsonwebtoken");
require("dotenv").config();

exports.auth = (req, res, next) => {
    try{
        //extract JWT token
        //PENDING : other ways to fetch token
        const token = req.body.token ;

        if(!token) {
            return res.status(401).json({
                success:false,
                message:'Token Missing',
            });
        }

        //verify the token
        try{
            const payload = jwt.verify(token, process.env.JWT_SECRET);
            console.log(payload);
            req.user = payload;
        } catch(error) {
            return res.status(401).json({
                success:false,
                message:'token is invalid',
            });
        }
        next();
    } 
    catch(error) {
        return res.status(401).json({
            success:false,
            message:'Something went wrong, while verifying the token',
        });
    }
}

exports.isUser = (req, res, next) => {
    try{
            if(req.user.role !== "User") {
                return res.status(401).json({
                    success:false,
                    message:'This is a protected route for Users.',
                });
            }
            next();
    }
    catch(error) {
        return res.status(500).json({
            success:false,
            message:'User Role is not matching',
        });
    }
}

exports.isAdmin = (req, res, next) => {
    try{
        if(req.user.role !== "Admin") {
            return res.status(401).json({
                success:false,
                message:'This is a protected route for Admins.',
            });
        }
        next();
    }
    catch(error) {
        return res.status(500).json({
            success:false,
            message:'User Role is not matching',
        });
    }
}

exports.isTutor = (req,res,next) => {
    try{
        if(req.user.role !== "Tutor") {
            return res.status(401).json({
                success:false,
                message:'This is a protected route for Tutors.',
            });
        }
        next();
    }
    catch(error) {
        return res.status(500).json({
            success:false,
            message:'User Role is not matching',
        });
    }
}