import { Support } from "../models/support";
import { fileChattingList } from "../models/user/fileChattingList";

module.exports = (io) => {
  io.on("connection", async (socket) => {
    socket.on("disconnect", async () => {
      // console.log("disconnect socket");
    });

    socket.on("sendToSupport", async (e) => {
      const alertMsg = `Received new message from ${e.name}`;
      await io.sockets.emit(e.data.to, { data: e.data, alertMsg });
      await saveChattingMsg(e.data);
    });
    socket.on("sendToSupportPerFile", async (e) => {
      const alertMsg = `Received new message from ${e.name}/R-ID: ${e.orderId}`;
      await io.sockets.emit(e.data.to, { data: e.data, alertMsg });
      await saveChattingMsg(e.data);
    });

    socket.on("sendToUser", async (e) => {
      const alertMsg = "Received new message";
      await io.sockets.emit(e.to, { data: e, alertMsg });
      await saveChattingMsg(e);
    });
    socket.on("sendToUserPerFile", async (e) => {
      const alertMsg = `Received message of admin about your upload file-${e.orderId}`;
      await io.sockets.emit(e.data.to, { data: e.data });
      await io.sockets.emit("fileReply" + e.data.to.substr(0, 24), {
        alertMsg,
        from: e.data.to
          .replace(e.data.to.substr(0, 24), "")
          .replace(e.orderId, ""),
      });
      await saveChattingMsg(e.data);
    });

    socket.on("request", async (e) => {
      const alertMsg = `Received upload file from ${e.name}`;
      await io.sockets.emit("request" + e.to, { alertMsg });
    });
    socket.on("reply", async (e) => {
      const alertMsg = `Received message of admin about your upload ${e.orderId} file`;
      await io.sockets.emit("answer" + e.to, { alertMsg });
    });
    socket.on("addChattingListPerFile", async (e) => {
      const data = {
        _id: e._id,
        name: e.name,
        profile: e.profile,
      };
      await io.sockets.emit("file" + e.to, { data });
      const result = await updateChattingStatusPerFile(e);
      await io.sockets.emit("totalUnreadCount" + e.userId, {
        count: result.nModified,
      });
      await saveChattingListPerFile(e);
    });
  });
};

const saveChattingMsg = async (data) => {
  try {
    const support = new Support(data);
    await support.save();
  } catch (error) {
    console.log(error);
  }
};

const saveChattingListPerFile = async (data) => {
  try {
    const exist = await fileChattingList.findOne({ name: data.name });
    if (!exist) {
      const fileList = new fileChattingList(data);
      await fileList.save();
    }
  } catch (error) {
    console.log(error);
  }
};

const updateChattingStatusPerFile = async (data) => {
  return await Support.updateMany({ to: data._id }, { status: true });
};
