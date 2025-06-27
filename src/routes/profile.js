const express = require("express");
const profileRouter = express.Router();
const { validateEditProfileData } = require("../utils/validation");
const bcrypt = require("bcrypt");
const { userAuth } = require("../middlewares/auth");
const validator = require("validator");

profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    const user = req.user;

    res.send(user);
  } catch (err) {
    res.status(400).send("ERROR : " + err.message);
  }
});

profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
  try {
    if (!validateEditProfileData(req)) {
      throw new Error("Invalid profile request");
    }

    const loggedInUser = req.user;
    Object.keys(req.body).forEach((key) => (loggedInUser[key] = req.body[key]));
    await loggedInUser.save();

    res.send("User profile has been updated successfuly");
  } catch (err) {
    res.status(500).send("Something went wrong" + err.message);
  }
});

profileRouter.patch("/profile/edit/password", userAuth, async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const user = req.user;
    console.log(user);

    const isMatchedPassword = await bcrypt.compare(oldPassword, user.password);
    if (!isMatchedPassword) {
      throw new Error("Your password does not match");
    } else if (!validator.isStrongPassword(newPassword)) {
      throw new Error("Please enter a strong password");
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedNewPassword;
    await user.save();

    res.send("Password updated successfully");
  } catch (err) {
    res.status(500).send("Something went wrong" + err.message);
  }
});

module.exports = profileRouter;
