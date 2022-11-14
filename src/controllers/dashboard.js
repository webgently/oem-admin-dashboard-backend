import { Service } from "../models/service";
import { Users } from "../models/sign";

export const getDashBoardData = async (req, res, next) => {
  let dashboard = {};
  const user = await Users.find({});
  const service = await Service.find({});
  dashboard.userCount = user.length;
  dashboard.serviceCount = service.length;
  res.send(dashboard);
};
