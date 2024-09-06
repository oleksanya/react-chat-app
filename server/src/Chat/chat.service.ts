import { Injectable } from '@nestjs/common';
import { Chat } from '../schemas/chat.schema';
import { Model, Types } from 'mongoose';

import { InjectModel } from '@nestjs/mongoose';
import { CreateChatDto } from './dto/createChat.dto';
import { Message } from 'src/schemas/message.schema';

@Injectable()
export class ChatService {
  constructor(
    @InjectModel(Chat.name) private chatModel: Model<Chat>,
    @InjectModel(Message.name) private messageModel: Model<Message>,
  ) {}

  async createChat(createChatDto: CreateChatDto): Promise<Chat> {
    const newChat = new this.chatModel(createChatDto);
    return newChat.save();
  }

  async findChatsByIds(chatIds: Types.ObjectId[]): Promise<Chat[]> {
    return this.chatModel.find({ _id: { $in: chatIds } }).exec();
  }

  async getChatsByUserId(userId: string): Promise<Chat[]> {
    return await this.chatModel
      .find({
        participants: new Types.ObjectId(userId),
      })
      .exec();
  }

  async getChatById(chatId: string): Promise<Chat> {
    return this.chatModel
      .findById(chatId)
      .populate({
        path: 'messages',
        model: 'Message',
      })
      .populate({
        path: 'participants',
        model: 'User',
        select: '-password -email -friends -chats', //exclude sensitive userdata
      })
      .exec();
  }

  async getLastChatMessage(chatId: string): Promise<Message> {
    return this.chatModel.findOne({ _id: chatId }, 'lastMessage');
  }
}
