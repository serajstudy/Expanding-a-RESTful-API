import express from "express";
import { users } from "../data/users.mjs";
const router = express.Router();

// @route GET /api/users
// @desc Get all users
// @access Public
router
  .route("/")
  .get((req, res) => {
    res.json(users);
  })
  .post((req, res) => {
    const { name, username, email } = req.body;

    // Check if we have all data needed to create user
    if (name && username && email) {
      // check is username exists!!
      if (users.find((u) => u.username == username)) {
        res.status(400).json({ err: "Username taken" });
        return;
      }

      const user = {
        id: users[users.length - 1].id + 1, //find the last users id number and add one to it.
        name,
        username,
        email,
      };
      users.push(user);
      res.json(user);
    } else res.status(400).json({ msg: "Insuffecient Data" });
  });

//  @route GET /api/users/:id
//  @desc Get ONE user
//  @access Public
router
  .route("/:id")
  .get((req, res, next) => {
    const user = users.find((user) => user.id == req.params.id);

    if (user) res.json(user);
    else next();
  })
  .patch((req, res, next) => {
    // find the user that the client wants to change
    const id = req.params.id;
    const data = req.body;

    const user = users.find((user, i) => {
      if (user.id == id) {
        for (const item in data) {
          users[i][item] = data[item]; // make the changes
        }
        return true;
      }
    });

    // send a response back to the client
    if (user) {
      res.json(users);
    } else next();
  })
  .delete((req, res, next) => {
    // find user the client wants to delete
    const id = req.params.id;
    const user = users.find((user, i) => {
      if (user.id == id) {
        users.splice(i, 1); // remove the user at index i
        return true;
      }
    });

    // send a response back to the client
    if (user) {
      res.json(users);
    } else next();
  });

export default router;
