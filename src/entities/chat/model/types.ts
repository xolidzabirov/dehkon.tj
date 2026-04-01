export interface Chat {
  id: number;
  isGlobal: boolean;
  participants: ChatParticipant[];
  lastMessage?: Message | null;
  createdAt: string;
}

export interface ChatParticipant {
  userId: number;
  userName: string;
  fullName: string;
}

export interface Message {
  id: number;
  chatId: number;
  senderId: number;
  senderName: string;
  text: string;
  isRead: boolean;
  createdAt: string;
}
