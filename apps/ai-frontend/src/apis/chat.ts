import request from "@/utils/http";

const chatApi = {
  getChatList: () => {
    return request<API.Chat.MessageListProps[]>({
      url: "/chat/list",
      method: "GET",
    });
  },

  getSpecificContents: (id) => {
    return request<API.Chat.ContentProps[]>({
      url: "/chat/contentList",
      method: "GET",
      params: { id },
    });
  },
};

export default chatApi;
