// routes/commentRoutes.mjs
import express from "express";
import { comments } from "../data/comments.mjs"; // create this file
const router = express.Router();


// @route GET /api/comments
// @desc Get all comments
// @access Public
router
  .route("/")
  .get((req, res) => {
    res.json(comments);
  })
  .post((req, res) => {
    const { userId,postId, body } = req.body;

    // Check if we have all data needed to create user
    if (userId && postId&& body) {
      // check is postId exists!!
      if (comments.find((comment) => comment.postId == postId)) {
        res.status(400).json({ err: "Commentsname taken" });
        return;
      }

      const comment = {
        id: comments[comments.length - 1].id + 1, //find the last comments id number and add one to it.
       userId,
        postId,
        body,
      };
      comments.push(comment);
      res.json(comment);
    } else res.status(400).json({ msg: "Insufficient Data" });
  });

//  @route GET /api/comments/:id
//  @desc Get ONE comments
//  @access Public
router
  .route("/:id")
  .get((req, res, next) => {
    const comment = comments.find((comment) => comment.id == req.params.id);

    if (comment) res.json(comment);
    else next();
  })
  .patch((req, res, next) => {
    // find the comments that the client wants to change
    const id = req.params.id;
    const data = req.body;

    const comment = comments.find((comment, i) => {
      if (comment.id == id) {
        for (const item in data) {
          comments[i][item] = data[item]; // make the changes
        }
        return true;
      }
    });

    // send a response back to the client
    if (comment) {
      res.json(comments);
    } else next();
  })
  .delete((req, res, next) => {
    // find user the client wants to delete
    const id = req.params.id;
    const comment = comments.find((comment, i) => {
      if (comment.id == id) {
        comments.splice(i, 1); // remove the user at index i
        return true;
      }
    });

    // send a response back to the client
    if (comment) {
      res.json(comments);
    } else next();
  });


  // @route GET /api/posts/:id/comments
// @desc Get all comments for a specific post, optional ?userId filter
router.get("/posts/:id/comments", (req, res) => {
  let results = comments.filter((comment) => comment.postId == req.params.id);

  if (req.query.userId) {
    results = results.filter((comment) => comment.userId == req.query.userId);
  }

  res.json(results);
});

// @route GET /api/users/:id/comments
// @desc Get all comments by a specific user, optional ?postId filter
router.get("/users/:id/comments", (req, res) => {
  let results = comments.filter((comment) => comment.userId == req.params.id);

  if (req.query.postId) {
    results = results.filter((comment) => comment.postId == req.query.postId);
  }

  res.json(results);
});

export default router;



