const express = require("express");
const router = express.Router();

const {login, signup, logout} = require("../controllers/Auth");
const {auth, isUser, isAdmin, isTutor} = require("../middlewares/auth");

router.post("/login", login, );
router.post("/signup", signup);
router.post("/logout", logout);


//Protected Route for Users
router.get("/user", auth, isUser, (req,res) => {
    res.json({
        success:true,
        message:'Welcome to the Protected route for Users',
    });
} );

// Protected route for Admins
router.get("/admin", auth, isAdmin, (req,res) => {
    res.json({
        success:true,
        message:'Welcome to the Protected route for Admins',
    });
});

// Protected route for Tutors
router.get("/tutor", auth, isTutor, (req,res) => {
    res.json({
        success:true,
        message:'Welcome to the Protected route for Tutor',
    });
});

module.exports = router;