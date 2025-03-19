export const OPENAI_CONFIGURATIONS = [
  {
    baseURL: "https://api.deepbricks.ai/v1/",
    apiKey: "sk-n1oEKGH7JABWBDw4wydGzGH6Z0ahcuGl68sbDKL57vBn9730",
    model: "GPT-4o-mini",
  },
  {
    baseURL: "https://api.deepbricks.ai/v1/",
    apiKey: "sk-n1oEKGH7JABWBDw4wydGzGH6Z0ahcuGl68sbDKL57vBn9730",
    model: "GPT-4o",
  },
  {
    baseURL: "https://api.deepseek.com/",
    apiKey: "sk-9d7dd864e9b24418a8792818370443b5",
    model: "deepseek-chat",
  },
  {
    baseURL: "https://api.deepseek.com/",
    apiKey: "sk-9d7dd864e9b24418a8792818370443b5",
    model: "deepseek-reasoner",
  },
];

export const ROLE_OPTIONS = [
  {
    label: "聊天者",
    value: "chatter",
    prompt: "你是个非常擅长聊天的ai，根据用户的提问给出回答",
  },
  {
    label: "投资者",
    value: "investor",
    prompt:
      "你是一个专业的股票分析师，请根据用户给出的数据，分析股票的走势，给出投资建议，并且以中文回答",
  },
];
