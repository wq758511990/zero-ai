import { Typography } from "antd";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism"; // 暗色代码主题
import remarkGfm from "remark-gfm"; // 支持表格、删除线等扩展语法

// 自定义 Markdown 渲染组件
const MarkdownRenderer = ({ content }) => {
  return (
    <ReactMarkdown
      children={content}
      remarkPlugins={[remarkGfm]}
      components={{
        // @ts-ignore
        code({ node, inline, className, children, ...props }) {
          const match = /language-(\w+)/.exec(className || "");
          return !inline && match ? (
            <SyntaxHighlighter
              children={String(children).replace(/\n$/, "")}
              style={vscDarkPlus}
              language={match[1]}
              PreTag="div"
              showLineNumbers // 显示行号
              wrapLongLines // 自动换行
              {...props}
            />
          ) : (
            <code
              className={className}
              style={{
                backgroundColor: "#f3f3f3",
                padding: "2px 6px",
                borderRadius: "4px",
                fontFamily: "monospace",
              }}
              {...props}
            >
              {children}
            </code>
          );
        },
        // 其他元素的自定义样式（可选）
        h1: ({ node, ...props }) => <Typography.Title level={3} {...props} />,
        blockquote: ({ node, ...props }) => (
          <blockquote
            style={{
              borderLeft: "4px solid #1890ff",
              margin: "12px 0",
              padding: "8px 16px",
              backgroundColor: "#f0f9ff",
              color: "#333",
            }}
            {...props}
          />
        ),
        table: ({ node, ...props }) => (
          <div style={{ overflowX: "auto" }}>
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                margin: "16px 0",
              }}
              {...props}
            />
          </div>
        ),
      }}
    />
  );
};

export default MarkdownRenderer;
