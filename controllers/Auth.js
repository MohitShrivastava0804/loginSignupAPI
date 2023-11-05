const bcrypt = require("bcrypt");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
// const { options } = require("../routes/user");
require("dotenv").config();

//signup route handler
exports.signup = async (req,res) => {
    try{
        //get data
        const {name, email, password, confirmPassword, role} = req.body;
        //check if user already exist
        if(!name || !email || !password || !confirmPassword || !role) {
            return res.status(400).json({
                success:false,
                message:'Please fill all the details carefully.',
            });
        }

        const existingUser = await User.findOne({email});

        if(existingUser){
            return res.status(400).json({
                success:false,
                message:'User already Exists',
            });
        }

        if(password != confirmPassword) {
            return res.status(400).json({
                success:false,
                message:'Passwords do not match',
            });
        }

        //secure password
        let hashedPassword;
        try{
            hashedPassword = await bcrypt.hash(password, 10);
        }
        catch(err) {
            return res.status(500).json({
                success:false,
                message:'Error inn hashing Password',
            });
        }

        //create entry for User
        const user = await User.create({
            name,email,password:hashedPassword,role
        })

        return res.status(200).json({
            success:true,
            message:'User Created Successfully',
        });

    }
    catch(error) {
        console.error(error);
        return res.status(500).json({
            success:false,
            message:'User cannot be registered, please try again later',
        });
    }
}

//login route handler
exports.login = async (req,res) => {
    try {
        //data fetch
        const {email, password} = req.body;
        //validation on email and password
        if(!email || !password) {
            return res.status(400).json({
                success:false,
                message:'PLease fill all the details carefully',
            });
        }

        //check for registered user
        let user = await User.findOne({email});
        //if not a registered user
        if(!user) {
            return res.status(401).json({
                success:false,
                message:'User is not registered',
            });
        }

        const payload = {
            email:user.email,
            id:user._id,
            role:user.role,
        };
        //verify password & generate a JWT token
        if(await bcrypt.compare(password, user.password) ) {
            //password match
            let token = jwt.sign(payload, process.env.JWT_SECRET,
                                {
                                    expiresIn:"2h",
                                });

            user = user.toObject();
            req.password = undefined;
            req.token = token;

            const options = {
                expires: new Date( Date.now() + 3 * 24 * 60 * 60 * 1000),
                httpOnly:true,
            }

            res.cookie("ccdbCredentials", token, options).status(200).json({
                success:true,
                token,
                user,
                message:'User Logged in successfully',
            });
        }
        else {
            //passwsord do not match
            return res.status(403).json({
                success:false,
                message:"Password Incorrect",
            });
        }

    }
    catch(error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:'Login Failure',
        });
    }
}

// logout route handler
exports.logout = (req,res) => {
    const token = req.body.token;

    if (!token) {
        return res.status(400).json({ message: 'Token is missing from the request body' });
    }

    try {
        // Verify the JWT token using your secret key
        jwt.verify(token, "JWT-SECRET", (err, decoded) => {
            if(err) {
                return res.status(401).json({ message: 'Invalid token' });
            }

            // Clear the JWT token from the client (e.g., remove the cookie)
            res.clearCookie('JWT_SECRET');

            // Redirect to the home page after a successful logout
            res.redirect('/'); // Change the URL to your home page route
        });
    } catch (error) {
        console.error('Error during logout:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}