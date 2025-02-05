import chatApi from "@/apis/chat";
import { RobotOutlined, UserOutlined } from "@ant-design/icons";
import { useMount, useRequest } from "ahooks";
import { Avatar, Button, Input, List, Space } from "antd";
import classNames from "classnames";
import { useEffect, useRef, useState } from "react";
import "./index.less";
import MarkdownRenderer from "./MarkdownRenderer";

const { TextArea } = Input;

type BufferType = {
  type: string;
  content: string | number;
};

type ContentProps = {
  role: string;
  content: string;
};

function ChatWindow() {
  const [messages, setMessages] = useState<ContentProps[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const controllerRef = useRef<AbortController>();
  const [currentId, setCurrentId] = useState(null);
  const messagesEndRef = useRef(null);

  const { run: runGetList, data: listRsp } = useRequest(chatApi.getChatList, {
    manual: true,
  });

  const { run: runGetContents } = useRequest(chatApi.getSpecificContents, {
    manual: true,
    onSuccess: (data) => {
      const handledData = data
        ?.map((item) => [
          { role: "user", content: item.quest },
          { role: "assistant", content: item.content },
        ])
        ?.flat();

      setMessages(handledData);
    },
  });

  const sendMessage = () => {
    if (!input.trim()) return;

    // 添加用户消息
    setMessages((prev) => [...prev, { role: "user", content: input }]);
    setInput("");
    setIsLoading(true);

    try {
      // 创建新的AbortController用于中断请求
      controllerRef.current = new AbortController();

      const { signal } = controllerRef.current;

      const eventStream = new EventSource(
        `http://localhost:3000/chat/base?msg=${input}&id=${currentId}`
      );

      // 添加初始助手消息
      setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

      eventStream.onmessage = (e) => {
        const jsonData: BufferType = JSON.parse(e.data);
        if (jsonData.type === "content") {
          setMessages((prev) => {
            const last = prev[prev.length - 1];
            return last.role === "assistant"
              ? [
                  ...prev.slice(0, -1),
                  { ...last, content: (last.content || "") + jsonData.content },
                ]
              : prev;
          });
        } else if (jsonData.type === "session") {
          if (!currentId) {
            runGetList();
          }
          setCurrentId(jsonData.content);
        }
      };

      eventStream.onerror = (e) => {
        console.error("error", e);
        eventStream.close();
      };

      signal.addEventListener("abort", () => {
        eventStream.close();
      });
    } catch (err: any) {
      if (err.name !== "AbortError") {
        console.error("请求失败:", err);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    sendMessage();
  };

  const handleItemClick = (item) => {
    setCurrentId(item.id);
    runGetContents(item.id);
  };

  const handleCreateNewChat = () => {
    setCurrentId(null);
    setMessages([]);
  };

  const scrollToBottom = (behavior = "smooth") => {
    messagesEndRef.current?.scrollIntoView({
      behavior: behavior, // 平滑滚动
      block: "nearest", // 对齐到可视区域底部
    });
  };

  const handleAbort = () => {
    controllerRef.current?.abort();
  };

  const handleKeyUp = (e) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  };

  useMount(() => {
    runGetList();
  });

  // 监听 messages 变化自动滚动
  useEffect(() => {
    console.log("message", messages[messages.length - 1]);
    // 当新消息是 AI 消息时自动滚动
    if (
      messages.length > 0 &&
      messages[messages.length - 1].role === "assistant"
    ) {
      scrollToBottom();
    }
  }, [messages]); // 依赖 messages 数组变化

  return (
    <div className="chat-container flex">
      <div className="chat-list h-full w-200px pt-8px px-8px">
        {listRsp?.map((item, index) => (
          <div
            key={index}
            onClick={() => {
              handleItemClick(item);
            }}
            className={classNames(
              `rounded-6px h-36px leading-36px pl-8px mb-8px cursor-pointer truncate`,
              {
                activeItem: currentId === item.id,
              }
            )}
          >
            {item.title}
          </div>
        ))}
        <div
          onClick={handleCreateNewChat}
          className="new-chat text-blue-300 h-36px leading-36px text-center cursor-pointer"
        >
          + 开启新的对话
        </div>
      </div>
      <div
        style={{
          margin: "0 auto",
          padding: "20px",
          border: "1px solid #f0f0f0",
          borderRadius: "8px",
          flex: 1,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div className="list-container h-80vh overflow-y-auto pb-16px">
          <List
            dataSource={messages}
            pagination={{
              simple: true,
              pageSize: 20,
              position: "top",
            }}
            renderItem={(message) => (
              <List.Item>
                <List.Item.Meta
                  avatar={
                    message.role === "user" ? (
                      <Avatar icon={<UserOutlined />} />
                    ) : (
                      <Avatar icon={<RobotOutlined />} />
                    )
                  }
                  title={message.role === "user" ? "User" : "Assistant"}
                  description={
                    <div
                      style={{
                        fontSize: 15,
                        lineHeight: 1.6,
                        color: message.role === "user" ? "#333" : "#1d1d1d",
                      }}
                    >
                      <MarkdownRenderer content={message.content} />
                    </div>
                  }
                />
              </List.Item>
            )}
          />
          <div ref={messagesEndRef} className="h-1px" />
        </div>
        {isLoading && (
          <div style={{ textAlign: "center", margin: "10px 0" }}>
            Loading...
          </div>
        )}
        <form onSubmit={handleSubmit} className="flex-1">
          <TextArea
            rows={5}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="请输入"
            onKeyUp={handleKeyUp}
            style={{ marginRight: "10px", resize: "none" }}
          />
          <Space className="mt-8px">
            <Button type="primary" htmlType="submit" loading={isLoading}>
              发送
            </Button>
            <Button onClick={handleAbort}>中断</Button>
          </Space>
        </form>
      </div>
    </div>
  );
}

export default ChatWindow;
