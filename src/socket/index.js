import { Support } from "../models/support";

module.exports = (io) => {
  io.on("connection", async (socket) => {
    socket.on("disconnect", async () => {
      // console.log("disconnect socket");
    });

    socket.on("sendToSupport", async (e) => {
      const alertMsg = "New Message Received";
      await io.sockets.emit(e.to, { data: e, alertMsg });
      await saveChattingMsg(e);
    });

    socket.on("sendToUser", async (e) => {
      const alertMsg = "New Message Received";
      await io.sockets.emit(e.to, { data: e, alertMsg });
      await saveChattingMsg(e);
    });

    socket.on("request", async (e) => {
      const alertMsg = "Received upload file from user";
      await io.sockets.emit("request" + e.to, { alertMsg });
    });

    socket.on("replyAboutRequest", async (e) => {
      const alertMsg = "Received result about your upload file";
      await io.sockets.emit("answer" + e.to, { alertMsg });
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
