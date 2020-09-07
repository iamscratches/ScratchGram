const express = require('express');
const router = express.Router();

const checkAuth = require('../middleware/check-auth');
const PostController = require('../controllers/post');
const extractFile = require('../middleware/file');
router.post('', checkAuth, extractFile, PostController.createPosts);
//3IXLHW75ihl7NHj1

router.put("/:id", checkAuth, extractFile, PostController.updatePost);

router.get('', PostController.getPosts);

router.get("/:id", PostController.getPostById);

router.delete("/:id", checkAuth, PostController.deletePost);

module.exports = router;
