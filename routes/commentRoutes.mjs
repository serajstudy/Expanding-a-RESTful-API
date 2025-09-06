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
    const { name, username, email } = req.body;

    // Check if we have all data needed to create user
    if (name && username && email) {
      // check is username exists!!
      if (comments.find((u) => u.username == username)) {
        res.status(400).json({ err: "Commentsname taken" });
        return;
      }

      const user = {
        id: comments[comments.length - 1].id + 1, //find the last comments id number and add one to it.
        name,
        username,
        email,
      };
      comments.push(user);
      res.json(user);
    } else res.status(400).json({ msg: "Insuffecient Data" });
  });

//  @route GET /api/comments/:id
//  @desc Get ONE comments
//  @access Public
router
  .route("/:id")
  .get((req, res, next) => {
    const user = comments.find((user) => user.id == req.params.id);

    if (user) res.json(user);
    else next();
  })
  .patch((req, res, next) => {
    // find the user that the client wants to change
    const id = req.params.id;
    const data = req.body;

    const user = comments.find((user, i) => {
      if (user.id == id) {
        for (const item in data) {
          comments[i][item] = data[item]; // make the changes
        }
        return true;
      }
    });

    // send a response back to the client
    if (user) {
      res.json(comments);
    } else next();
  })
  .delete((req, res, next) => {
    // find user the client wants to delete
    const id = req.params.id;
    const user = comments.find((user, i) => {
      if (user.id == id) {
        comments.splice(i, 1); // remove the user at index i
        return true;
      }
    });

    // send a response back to the client
    if (user) {
      res.json(comments);
    } else next();
  });

export default router;



