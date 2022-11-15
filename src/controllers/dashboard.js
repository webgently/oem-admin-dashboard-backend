import { Service } from "../models/service";
import { Users } from "../models/sign";
import { Support } from "../models/support";
import { Upload } from "../models/user/uploadFile";

export const getDashBoardData = async (req, res, next) => {
  try {
    let dashboard = {};
    const user = await Users.find({});
    const service = await Service.find({});
    const upload = await Upload.find({});
    const support = await Support.find({ status: false });
    dashboard.userCount = user.length;
    dashboard.serviceCount = service.length;
    dashboard.requestCount = upload.length;
    dashboard.supportCount = support.length;
    res.send(dashboard);
  } catch (error) {
    console.log(error);
  }
};
