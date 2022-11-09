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


export default router;
