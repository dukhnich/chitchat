export interface Channel {
    id: number;
    name: string;
    members: number;
    description?: string;
}

export interface User {
  name: string;
  role: string;
  avatarFilename?: string;
}

export interface BaseMessage {
  id: number;
  user: User;
  time: string;
  content: string;
}

export interface ChannelMessage extends BaseMessage {
  type: "channelMessage";
  channelId: number;
  threadMessages: number;
}

export interface ThreadMessage extends BaseMessage {
  type: "threadMessage";
  parentId: number;
}

export type Message = ChannelMessage | ThreadMessage;