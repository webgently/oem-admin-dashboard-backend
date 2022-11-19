import { Support } from "../models/support";
import { Users } from "../models/sign";

module.exports = (io) => {
  io.on("connection", async (socket) => {
    socket.on("disconnect", async () => {
      // console.log("disconnect socket");
    });

    socket.on("sendToSupport", async (e) => {
      let data = e;
      e.msg = "New Message Received";
      await io.sockets.emit(e.to, data);
      await saveChattingMsg(e);
    });

    socket.on("sendToUser", async (e) => {
      let data = e;
      e.msg = "New Message Received";
      await io.sockets.emit(e.to, data);
      await saveChattingMsg(e);
    });

    socket.on("request", async (e) => {
      let data = e;
      e.msg = "Received upload file from user";
      await io.sockets.emit(e.to, data);
    });

    socket.on("replyAboutRequest", async (e) => {
      let data = e;
      e.msg = "Received result about your upload file";
      await io.sockets.emit(e.to, data);
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
