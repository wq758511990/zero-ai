import { Inject, Injectable } from '@nestjs/common';
import { OPENAI_CONFIGURATIONS } from '@repo/shared-constants';
import OpenAI from 'openai';
import { Observable } from 'rxjs';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ChatService {
  @Inject(PrismaService)
  private prisma: PrismaService;

  async createResponseStream(
    prompt: string,
    model = 'GPT-4o-mini',
    id?: number,
  ): Promise<Observable<string>> {
    try {
      const modelConfig = OPENAI_CONFIGURATIONS.find(
        (item) => item.model === model,
      );

      console.log('modelConfig', modelConfig);

      const openai = new OpenAI({
        baseURL: modelConfig.baseURL,
        apiKey: modelConfig.apiKey,
      });

      const messages = id ? await this.getChatMessages(id) : [];
      messages.push({ role: 'user', content: prompt });
      const stream = await openai.chat.completions.create({
        model,
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        messages,
        stream: true,
      });

      return new Observable((observer) => {
        (async () => {
          try {
            for await (const chunk of stream) {
              const content = chunk.choices[0].delta?.content ?? '';
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

  private async getChatMessages(
    chatId: number,
  ): Promise<Array<{ role: string; content: string }>> {
    const chatContents = await this.findContents(chatId);
    return chatContents
      .map((content) => [
        {
          role: 'user',
          content: content.quest,
        },
        { role: 'assistant', content: content.content },
      ])
      ?.flat();
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
      orderBy: {
        createdTime: 'asc',
      },
    });
  }
}
