const express = require("express")
const router = express.Router()
const authController = require("../controllers/authController")
const blogController = require("../controllers/blogController")
const commentController = require("../controllers/commentController")
const auth = require("../middlewares/auth")

// there are some routes : 
// User
// login
router.post("/login",authController.login)
// register
router.post("/register",authController.register)
// logout
router.post("/logout",auth,authController.logOut)
// refresh
router.get("/refresh",authController.Refresh)
// refresh ka kam isliye krrha hein kay user ka token jab expire hojahay tw ye automatically user ka token refresh krwaday user ko login na krna paray

// blog
// Create
router.post("/blog",auth,blogController.create)
// read all blog 
router.get("/blog/all",auth,blogController.getAll)
// read blog by ID
router.get("/blog/:id",auth, blogController.getById)
// update
router.put("/blog",auth,blogController.update)
// delete
router.delete("/blog/:id",auth,blogController.delete)

// comment
// create
router.post("/comment",commentController.create)
// read comment by blog ID
router.get("/comment/:id",commentController.getById)
// update
// delete


module.exports = router