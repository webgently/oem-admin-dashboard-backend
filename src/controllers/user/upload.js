import { Upload } from "../../models/user/uploadFile";

export const uploadFileDataSave = async (req, res, next) => {
  try {
    const data = JSON.parse(req.body.data);
    data.fileRename = req.files[0].filename;
    const exist = await Upload.find({});
    if (data.orderId === 0) data.orderId = 1;
    else data.orderId = exist.length + 1;
    const upload = new Upload(data);
    const result = await upload.save();
    if (result) {
      res.send({ status: true, data: "Saved successfully" });
    } else {
      res.send({ status: false, data: "Interanal server error" });
    }
  } catch (error) {
    console.log(error);
  }
};

export const uploadFile = async (req, res, next) => {
  let d = req.files;
  let row = {};
  for (let i in d) {
    row[d[i].fieldname] = d[i].filename;
  }
  req.images = row;
  next();
};
