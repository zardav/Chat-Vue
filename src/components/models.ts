export interface Todo {
  id: number;
  content: string;
}

export interface Meta {
  totalCount: number;
}

export interface Message {
  content: string,
  senderId: number,
  senderName: string,
  targetName: string,
  time: Date,
  isPrivate: boolean
}