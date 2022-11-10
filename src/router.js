import routerx from "express-promise-router";
import {
  signup,
  signin,
  getUserData,
  updateNote,
  updatestatus,
  deleteUser,
  addCredit,
  subtractCredit,
} from "./controllers/sign";

import {
  addService,
  updateService,
  getAllService,
  getOneService,
  deleteService
} from "./controllers/service";

import {
  getDashBoardData
} from "./controllers/dashboard";

import {
  addPrice,
  updatePrice,
  deletePrice,
  getAllPrice,
  getOnePrice,
  getServiceType
} from "./controllers/price"

import {
  createCredit,
  updateCredit,
  deleteCredit,
  getAllCredit,
  getOneCredit,
  updateFee,
  getFee
} from "./controllers/credit"

import {
  updateProfile,
  savePrivacy,
  getPrivacy,
  changePassword,
  getAllDaily,
  updateDaily,
  getOneDaily,
  uploadLogo,
  uploadDataSave,
  getLogo,
} from "./controllers/setting.js"

const multer = require("multer");
const FileUploader = require("./upload.js");
const path = require("path");
const fileconfig = require("./dir");
const Uploader = new FileUploader(path.join(fileconfig.logoBaseUrl));

const router = routerx();
// user
router.post("/signup", signup);
router.post("/signin", signin);
router.get("/getUserData", getUserData);
router.post("/updateNote", updateNote);
router.post("/updatestatus", updatestatus);
router.post("/deleteUser", deleteUser);
router.post("/addCredit", addCredit);
router.post("/subtractCredit", subtractCredit);
router.post("/subtractCredit", subtractCredit);
// service 
router.post("/addService", addService);
router.post("/updateService", updateService);
router.post("/getAllService", getAllService);
router.post("/getOneService", getOneService);
router.post("/deleteService", deleteService);
// dashboard 
router.post("/getDashBoardData", getDashBoardData);
// price lists
router.post("/getServiceType", getServiceType);
router.post("/addPrice", addPrice);
router.post("/updatePrice", updatePrice);
router.post("/deletePrice", deletePrice);
router.post("/getAllPrice", getAllPrice);
router.post("/getOnePrice", getOnePrice);
// credit lists
router.post("/createCredit", createCredit);
router.post("/updateCredit", updateCredit);
router.post("/deleteCredit", deleteCredit);
router.post("/getAllCredit", getAllCredit);
router.post("/getOneCredit", getOneCredit);
router.post("/updateFee", updateFee);
router.post("/getFee", getFee);
// setting 
router.post("/updateProfile", updateProfile);
router.post("/savePrivacy", savePrivacy);
router.post("/getPrivacy", getPrivacy);
router.post("/changePassword", changePassword);
router.post("/getAllDaily", getAllDaily);
router.post("/updateDaily", updateDaily);
router.post("/getOneDaily", getOneDaily);
router.post("/uploadLogo", uploadLogo);
router.post(
  "/uploadLogo",
  multer({ storage: Uploader.storage, fileFilter: Uploader.filter }).any(),
  uploadLogo,
  uploadDataSave
);
router.post("/getLogo", getLogo);

export default router;
