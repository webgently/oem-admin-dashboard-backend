import routerx from "express-promise-router";
const multer = require("multer");
const FileUploader = require("./upload.js");
const path = require("path");
const fileconfig = require("./dir");
const Uploader1 = new FileUploader(path.join(fileconfig.logoBaseUrl));
const Uploader2 = new FileUploader(path.join(fileconfig.fileServiceUrl));
const router = routerx();

/* User Manage */
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
router.post("/signup", signup);
router.post("/signin", signin);
router.get("/getUserData", getUserData);
router.post("/updateNote", updateNote);
router.post("/updatestatus", updatestatus);
router.post("/deleteUser", deleteUser);
router.post("/addCredit", addCredit);
router.post("/subtractCredit", subtractCredit);
router.post("/subtractCredit", subtractCredit);

/* Admin Settings */
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
  uploadAvatar,
  uploadAvatarDataSave,
  getLogo,
  getAvatar,
} from "./controllers/setting";
router.post("/updateProfile", updateProfile);
router.post("/savePrivacy", savePrivacy);
router.post("/getPrivacy", getPrivacy);
router.post("/changePassword", changePassword);
router.post("/getAllDaily", getAllDaily);
router.post("/updateDaily", updateDaily);
router.post("/getOneDaily", getOneDaily);
router.post("/uploadLogo", uploadLogo);
router.post(
  "/uploadAvatar",
  multer({ storage: Uploader1.storage, fileFilter: Uploader1.filter }).any(),
  uploadAvatar,
  uploadAvatarDataSave
);
router.post(
  "/uploadLogo",
  multer({ storage: Uploader1.storage, fileFilter: Uploader1.filter }).any(),
  uploadLogo,
  uploadDataSave
);
router.post("/getLogo", getLogo);
router.post("/getAvatar", getAvatar);

/* Support */
import {
  getSupportID,
  getUserList,
  getChattingHistory,
  updateReadStatus,
  getUserUnreadCount,
  getUserUnreadPerFileCount,
  updateUserReadStatus,
} from "./controllers/support";
router.post("/getSupportID", getSupportID);
router.post("/getUserList", getUserList);
router.post("/getChattingHistory", getChattingHistory);
router.post("/updateReadStatus", updateReadStatus);
router.post("/getUserUnreadCount", getUserUnreadCount);
router.post("/getUserUnreadPerFileCount", getUserUnreadPerFileCount);
router.post("/updateUserReadStatus", updateUserReadStatus);

/* Credit List */
import {
  createCredit,
  updateCredit,
  deleteCredit,
  getAllCredit,
  getOneCredit,
  updateFee,
  getFee,
} from "./controllers/credit";
router.post("/createCredit", createCredit);
router.post("/updateCredit", updateCredit);
router.post("/deleteCredit", deleteCredit);
router.post("/getAllCredit", getAllCredit);
router.post("/getOneCredit", getOneCredit);
router.post("/updateFee", updateFee);
router.post("/getFee", getFee);

/* Price List */
import {
  addPrice,
  updatePrice,
  deletePrice,
  getAllPrice,
  getOnePrice,
  getServiceType,
} from "./controllers/price";
router.post("/getServiceType", getServiceType);
router.post("/addPrice", addPrice);
router.post("/updatePrice", updatePrice);
router.post("/deletePrice", deletePrice);
router.post("/getAllPrice", getAllPrice);
router.post("/getOnePrice", getOnePrice);

/* Services */
import {
  addService,
  updateService,
  getAllService,
  getOneService,
  deleteService,
} from "./controllers/service";
router.post("/addService", addService);
router.post("/updateService", updateService);
router.post("/getAllService", getAllService);
router.post("/getOneService", getOneService);
router.post("/deleteService", deleteService);

/* Dashboard */
import {
  getDashBoardData,
  getServiceTime,
  getSumCredit,
} from "./controllers/dashboard";
router.post("/getDashBoardData", getDashBoardData);
router.post("/getServiceTime", getServiceTime);
router.post("/getSumCredit", getSumCredit);

/* Admin Upload */
import {
  getRequests,
  getOneRequest,
  updateUpload,
  uploadUploadDataSave,
  changeStatus,
  setRequestStatus,
  uploadStatusSave,
} from "./controllers/user/requests";
router.post("/getRequests", getRequests);
router.post("/getOneRequest", getOneRequest);
router.post(
  "/updateUpload",
  multer({ storage: Uploader2.storage, fileFilter: Uploader2.filter }).any(),
  updateUpload,
  uploadUploadDataSave
);
router.post("/changeStatus", changeStatus);
router.post("/setRequestStatus", setRequestStatus);
router.post("/uploadStatusSave", uploadStatusSave);

/* Buy Credits */
import {
  buyCredit,
  getAllInvoice,
  getOneInvoice,
  getUserInvoiceHistory,
} from "./controllers/user/buyCredit";
router.post("/buyCredit", buyCredit);
router.post("/getAllInvoice", getAllInvoice);
router.post("/getOneInvoice", getOneInvoice);
router.post("/getUserInvoiceHistory", getUserInvoiceHistory);

/* User Upload Request */
import { uploadFile, uploadFileDataSave } from "./controllers/user/upload";
router.post(
  "/uploadFile",
  multer({ storage: Uploader2.storage, fileFilter: Uploader2.filter }).any(),
  uploadFile,
  uploadFileDataSave
);

/* Files Overview */
import { getDataByOrderID, getDataByFilter } from "./controllers/user/overview";
router.post("/getDataByOrderID", getDataByOrderID);
router.post("/getDataByFilter", getDataByFilter);

/* Credit History */
import {
  getCreditHistory,
  getCreditByOrderID,
} from "./controllers/user/creditHistory";
router.post("/getCreditHistory", getCreditHistory);
router.post("/getCreditByOrderID", getCreditByOrderID);

export default router;
