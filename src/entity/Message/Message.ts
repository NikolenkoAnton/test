import { MessageHeader } from './MessageHeader';
import { MessageBody } from './MessageBody';

export interface Message {
  Header: MessageHeader;
  Body: MessageBody;
}
