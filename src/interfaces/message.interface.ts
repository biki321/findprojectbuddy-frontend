export interface IMessage {
  text: string;
  receiverId: number;
  senderId: number;
  id?: number;
  sent?: boolean;
}
