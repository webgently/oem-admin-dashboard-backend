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
  deleteService,
} from "./controllers/service";

import { getDashBoardData } from "./controllers/dashboard";

import {
  addPrice,
  updatePrice,
  deletePrice,
  getAllPrice,
  getOnePrice,
  getServiceType,
} from "./controllers/price";

import {
  createCredit,
  updateCredit,
  deleteCredit,
  getAllCredit,
  getOneCredit,
  updateFee,
  getFee,
} from "./controllers/credit";

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
} from "./controllers/setting";

import {
  getSupportID,
  getUserList,
  getChattingHistory,
} from "./controllers/support";

// user
import { uploadFile, uploadFileDataSave } from "./controllers/user/upload";
import { getDataByOrderID, getDataByFilter } from "./controllers/user/overview";
import {
  getRequests,
  getOneRequest,
  updateUpload,
  uploadUploadDataSave,
  changeStatus,
} from "./controllers/user/requests";

const multer = require("multer");
const FileUploader = require("./upload.js");
const path = require("path");
const fileconfig = require("./dir");
const Uploader1 = new FileUploader(path.join(fileconfig.logoBaseUrl));
const Uploader2 = new FileUploader(path.join(fileconfig.fileServiceUrl));
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
  multer({ storage: Uploader1.storage, fileFilter: Uploader1.filter }).any(),
  uploadLogo,
  uploadDataSave
);
router.post("/getLogo", getLogo);
// support
router.post("/getSupportID", getSupportID);
router.post("/getUserList", getUserList);
router.post("/getChattingHistory", getChattingHistory);

router.post(
  "/uploadFile",
  multer({ storage: Uploader2.storage, fileFilter: Uploader2.filter }).any(),
  uploadFile,
  uploadFileDataSave
);
// files overview
router.post("/getDataByOrderID", getDataByOrderID);
router.post("/getDataByFilter", getDataByFilter);
router.post("/getRequests", getRequests);
router.post("/getOneRequest", getOneRequest);

router.post(
  "/updateUpload",
  multer({ storage: Uploader2.storage, fileFilter: Uploader2.filter }).any(),
  updateUpload,
  uploadUploadDataSave
);
router.post("/changeStatus", changeStatus);

export default router;
