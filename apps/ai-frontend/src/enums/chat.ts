export enum GPTModelEnum {
  GPT4oMini = "GPT-4o-mini",
  GPT4o = "GPT-4o",
  "deepseek-chat" = "deepseek-chat",
  "deepseek-reasoner" = "deepseek-reasoner",
}

export const GPTOptions = [
  { value: GPTModelEnum.GPT4oMini, label: "GPT-4o-mini" },
  { value: GPTModelEnum.GPT4o, label: "GPT-4o" },
  { value: GPTModelEnum["deepseek-chat"], label: "deepseek-chat" },
  { value: GPTModelEnum["deepseek-reasoner"], label: "deepseek-reasoner" },
];
