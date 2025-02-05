import axiosInstance from "@/utils/http";

const chatApi = {
  getChatList: () => {
    return axiosInstance.get("/chat/list");
  },

  getSpecificContents: (id) => {
    return axiosInstance.get("/chat/contentList", {
      params: {
        id,
      },
    });
  },
};

export default chatApi;
