import { Button } from "antd";
import React from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { darcula } from "react-syntax-highlighter/dist/esm/styles/prism";
import remarkGfm from "remark-gfm";

interface MarkdownRendererProps {
  content: string;
}

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
  return (
    <ReactMarkdown
      children={content}
      remarkPlugins={[remarkGfm]}
      // rehypePlugins={[rehypeHighlight]}
      components={{
        // @ts-ignore
        code({ node, inline, className, children, ...props }) {
          console.log("node", node, inline, className);
          const match = /language-(\w+)/.exec(className || "");
          return !inline && match ? (
            <div style={{ position: "relative" }}>
              <SyntaxHighlighter
                style={darcula}
                language={match[1]}
                PreTag="div"
                {...props}
              >
                {String(children).replace(/\n$/, "")}
              </SyntaxHighlighter>
              <CopyToClipboard text={String(children)}>
                <Button
                  color="primary"
                  style={{ position: "absolute", top: "10px", right: "10px" }}
                >
                  Copy
                </Button>
              </CopyToClipboard>
            </div>
          ) : (
            <code className={className} {...props}>
              {children}
            </code>
          );
        },
      }}
    />
  );
};

export default MarkdownRenderer;
