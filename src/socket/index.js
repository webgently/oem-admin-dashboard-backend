import { Support } from "../models/support";
import {Users} from "../models/sign";

module.exports = (io) => {
  io.on("connection", async (socket) => {
    socket.on("disconnect", async () => {
      // console.log("disconnect socket");
    });

    socket.on("sendToSupport", async (e) => {
      await io.sockets.emit(e.to, { data: e });
      await saveChattingMsg(e);
    });

    socket.on("sendToUser", async (e) => {
      await io.sockets.emit(e.to, { data: e });
      await saveChattingMsg(e);
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