const express = require("express");
const multer = require("multer");
const FileUploader = require("./upload.js");
const path = require("path");
const fileconfig = require("./dir");
const Uploader1 = new FileUploader(path.join(fileconfig.logoBaseUrl));
const Uploader2 = new FileUploader(path.join(fileconfig.fileServiceUrl));
const Uploader3 = new FileUploader(path.join(fileconfig.chatServiceUrl));

const router = express.Router();

/* User Manage */
const {
  signup,
  signin,
  getUserData,
  updateNote,
  updatestatus,
  updatetax,
  deleteUser,
  addCredit,
  subtractCredit,
  forgotPassword,
  resetPassword,
  checkResetLink,
} = require("./controllers/sign");
router.post("/signup", signup);
router.post("/signin", signin);
router.post("/getUserData", getUserData);
router.post("/updateNote", updateNote);
router.post("/updatestatus", updatestatus);
router.post("/updatetax", updatetax);
router.post("/deleteUser", deleteUser);
router.post("/addCredit", addCredit);
router.post("/subtractCredit", subtractCredit);
router.post("/forgotPassword", forgotPassword);
router.post("/resetPassword", resetPassword);
router.post("/checkResetLink", checkResetLink);

/* Admin Settings */
const {
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
  uploadBg,
  uploadBgDataSave,
  getLogo,
  getAvatar,
  getBg,
} = require("./controllers/setting");
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
  "/uploadBg",
  multer({ storage: Uploader1.storage, fileFilter: Uploader1.filter }).any(),
  uploadBg,
  uploadBgDataSave
);
router.post(
  "/uploadLogo",
  multer({ storage: Uploader1.storage, fileFilter: Uploader1.filter }).any(),
  uploadLogo,
  uploadDataSave
);
router.post("/getLogo", getLogo);
router.post("/getAvatar", getAvatar);
router.post("/getBg", getBg);

/* Support */
const {
  getSupportID,
  getUserList,
  getChattingHistory,
  updateReadStatus,
  getUserUnreadCount,
  getUserUnreadPerFileCount,
  updateUserReadStatus,
  uploadChatFile,
  sendToUserPerFile,
  sendToUser,
  sendToSupport,
  sendToSupportPerFile,
  sendToArchive,
  sendToChatBox,
} = require("./controllers/support");

router.post("/getSupportID", getSupportID);
router.post("/getUserList", getUserList);
router.post("/getChattingHistory", getChattingHistory);
router.post("/updateReadStatus", updateReadStatus);
router.post("/getUserUnreadCount", getUserUnreadCount);
router.post("/getUserUnreadPerFileCount", getUserUnreadPerFileCount);
router.post("/updateUserReadStatus", updateUserReadStatus);
router.post("/sendToArchive", sendToArchive);
router.post("/sendToChatBox", sendToChatBox);
router.post(
  "/sendToUserPerFile",
  multer({ storage: Uploader3.storage, fileFilter: Uploader3.filter }).any(),
  uploadChatFile,
  sendToUserPerFile
);
router.post(
  "/sendToUser",
  multer({ storage: Uploader3.storage, fileFilter: Uploader3.filter }).any(),
  uploadChatFile,
  sendToUser
);
router.post(
  "/sendToSupport",
  multer({ storage: Uploader3.storage, fileFilter: Uploader3.filter }).any(),
  uploadChatFile,
  sendToSupport
);
router.post(
  "/sendToSupportPerFile",
  multer({ storage: Uploader3.storage, fileFilter: Uploader3.filter }).any(),
  uploadChatFile,
  sendToSupportPerFile
);
/* Credit List */
const {
  createCredit,
  updateCredit,
  deleteCredit,
  getAllCredit,
  getOneCredit,
  updateFee,
  getFee,
} = require("./controllers/credit");
router.post("/createCredit", createCredit);
router.post("/updateCredit", updateCredit);
router.post("/deleteCredit", deleteCredit);
router.post("/getAllCredit", getAllCredit);
router.post("/getOneCredit", getOneCredit);
router.post("/updateFee", updateFee);
router.post("/getFee", getFee);

/* Price List */
const {
  addPrice,
  updatePrice,
  deletePrice,
  getAllPrice,
  getOnePrice,
  getServiceType,
} = require("./controllers/price");
router.post("/getServiceType", getServiceType);
router.post("/addPrice", addPrice);
router.post("/updatePrice", updatePrice);
router.post("/deletePrice", deletePrice);
router.post("/getAllPrice", getAllPrice);
router.post("/getOnePrice", getOnePrice);

/* Services */
const {
  addService,
  updateService,
  getAllService,
  getOneService,
  deleteService,
} = require("./controllers/service");
router.post("/addService", addService);
router.post("/updateService", updateService);
router.post("/getAllService", getAllService);
router.post("/getOneService", getOneService);
router.post("/deleteService", deleteService);

/* Dashboard */
const {
  getDashBoardData,
  getServiceTime,
  getSumCredit,
} = require("./controllers/dashboard");
router.post("/getDashBoardData", getDashBoardData);
router.post("/getServiceTime", getServiceTime);
router.post("/getSumCredit", getSumCredit);

/* Admin Upload */
const {
  getRequests,
  getOneRequest,
  updateUpload,
  uploadUploadDataSave,
  changeStatus,
  setRequestStatus,
  uploadStatusSave,
} = require("./controllers/user/requests");
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
const {
  buyCredit,
  getAllInvoice,
  getOneInvoice,
  getUserInvoiceHistory,
} = require("./controllers/user/buyCredit");
router.post("/buyCredit", buyCredit);
router.post("/getAllInvoice", getAllInvoice);
router.post("/getOneInvoice", getOneInvoice);
router.post("/getUserInvoiceHistory", getUserInvoiceHistory);

/* User Upload Request */
const { uploadFile, uploadFileDataSave } = require("./controllers/user/upload");
router.post(
  "/uploadFile",
  multer({ storage: Uploader2.storage, fileFilter: Uploader2.filter }).any(),
  uploadFile,
  uploadFileDataSave
);

/* Files Overview */
const {
  getDataByOrderID,
  getDataByFilter,
} = require("./controllers/user/overview");
router.post("/getDataByOrderID", getDataByOrderID);
router.post("/getDataByFilter", getDataByFilter);

/* Credit History */
const {
  getCreditHistory,
  getCreditByOrderID,
} = require("./controllers/user/creditHistory");
router.post("/getCreditHistory", getCreditHistory);
router.post("/getCreditByOrderID", getCreditByOrderID);

module.exports = router;
