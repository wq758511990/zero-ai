import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';
import { Observable } from 'rxjs';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ChatService {
  private openai: OpenAI;

  @Inject(PrismaService)
  private prisma: PrismaService;

  constructor(private configService: ConfigService) {
    this.openai = new OpenAI({
      baseURL: this.configService.get('baseURL'),
      apiKey: this.configService.get('apiKey'),
    });
  }

  async createResponseStream(prompt: string): Promise<Observable<string>> {
    try {
      const stream = await this.openai.chat.completions.create({
        model: 'GPT-4o-mini',
        messages: [
          { role: 'system', content: '你是一个专业的投资助手' },
          { role: 'user', content: prompt },
        ],
        stream: true,
      });

      return new Observable((observer) => {
        (async () => {
          try {
            for await (const chunk of stream) {
              const content = chunk.choices[0].delta?.content ?? '';
              console.log('content', content);
              observer.next(content);
            }
            observer.complete();
          } catch (error) {
            observer.error(error);
          }
        })();
      });
    } catch (error) {
      return new Observable((observer) => observer.error(error));
    }
  }

  async findAllList() {
    const chatList = await this.prisma.chat.findMany({});

    return chatList;
  }

  async insertChatContent(content: string, quest: string, id: number) {
    return await this.prisma.chatContent.create({
      data: {
        content,
        role: '',
        quest,
        chatId: id,
      },
    });
  }

  async insertChat(content: string, quest: string) {
    return await this.prisma.chat.create({
      data: {
        title: quest,
        contents: {
          create: [
            {
              content,
              role: '',
              quest,
            },
          ],
        },
      },
    });
  }

  async findContents(id: number) {
    return await this.prisma.chatContent.findMany({
      where: {
        chatId: id,
      },
    });
  }
}
