import classNames from "classnames";
import { useEffect, useRef } from "react";
import AutoSizer from "react-virtualized-auto-sizer";
import { VariableSizeList } from "react-window";
import MarkdownRenderer from "./MarkdownRenderer";

const getItemSize = (index: number, messages: any[]) => {
  const content = messages[index].content;
  return Math.max(50, content.split("\n").length * 20);
};

const Row = ({ index, style, data }) => {
  const message = data[index];
  return (
    <div style={style}>
      <div
        style={{
          fontSize: 15,
          lineHeight: 1.5,
          color: message.role === "user" ? "#333" : "#1d1d1d",
        }}
        className={classNames({
          userContent: message.role === "user",
          assistantContent: message.role === "assistant",
        })}
      >
        <MarkdownRenderer content={message.content} />
      </div>
    </div>
  );
};

const VirtualList = ({ messages }) => {
  const listRef = useRef<VariableSizeList>(null);

  useEffect(() => {
    if (listRef.current) {
      listRef.current.resetAfterIndex(0);
    }
  }, [messages]);

  return (
    <AutoSizer>
      {({ height, width }) => (
        <VariableSizeList
          ref={listRef}
          height={height}
          width={width}
          itemCount={messages.length}
          itemSize={(index) => getItemSize(index, messages)}
          itemData={messages}
        >
          {Row}
        </VariableSizeList>
      )}
    </AutoSizer>
  );
};

export default VirtualList;
