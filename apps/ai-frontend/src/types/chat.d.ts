declare namespace API.Chat {
  type MessageListProps = {
    id: number;
    title: string;
  };

  type ContentProps = {
    id: number;
    content: string;
    quest: string;
    role: string;
    modelRole: string;
  };
}
