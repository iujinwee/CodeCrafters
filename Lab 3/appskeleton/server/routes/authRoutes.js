const express = require("express");
const accountManagerController = require("../controllers/AccountManager");

// router is an instance of the express router.
// We use it to define our routes.
// The router will be added as a middleware and will take control of requests starting with path /record.
const router = express.Router();

router.get("/auth/get", accountManagerController.getAccount);

router.get("/auth/account/:id", accountManagerController.getAccountInfo);

router.post("/auth/signup", accountManagerController.createAccount);

router.post("/auth/update/:id", accountManagerController.updatePassword);

router.post("/auth/login", accountManagerController.loginAccount);

module.exports = router;
