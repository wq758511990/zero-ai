import { Inject, Injectable } from '@nestjs/common';
import { OPENAI_CONFIGURATIONS, ROLE_OPTIONS } from '@repo/shared-constants';
import OpenAI from 'openai';
import { Observable } from 'rxjs';
import { NewsService } from 'src/news/news.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { StockService } from 'src/stock/stock.service';
import { getStockPrompt } from 'src/utils';

@Injectable()
export class ChatService {
  @Inject(PrismaService)
  private prisma: PrismaService;

  @Inject(StockService)
  private stockService: StockService;

  @Inject(NewsService)
  private newsService: NewsService;

  async getStockPrompt(prompt: string) {
    const stockData = await this.stockService.getStockData(prompt);
    const news = await this.newsService.getStockNews(prompt);

    return getStockPrompt(prompt, stockData, news);
  }

  async getPrompt(prompt: string, roleConfig: any) {
    const role = roleConfig.value;

    const promptHandler: {
      chatter: () => Promise<string>;
      investor: () => Promise<string>;
    } = {
      chatter: () => Promise.resolve(prompt),
      investor: () => this.getStockPrompt(prompt),
    };

    return await promptHandler[role]();
  }

  async createResponseStream(
    prompt: string,
    model = 'GPT-4o-mini',
    id?: number,
    role?: string,
  ): Promise<Observable<string>> {
    try {
      const modelConfig = OPENAI_CONFIGURATIONS.find(
        (item) => item.model === model,
      );
      const roleConfig =
        ROLE_OPTIONS.find((item) => item.value === role) ?? ROLE_OPTIONS[0];

      const openai = new OpenAI({
        baseURL: modelConfig.baseURL,
        apiKey: modelConfig.apiKey,
      });

      const ansPrompt = await this.getPrompt(prompt, roleConfig);

      const messages = id ? await this.getChatMessages(id) : [];
      messages.unshift({ role: 'system', content: roleConfig.prompt });
      messages.push({ role: 'user', content: ansPrompt });

      console.log('message', messages);
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

  async insertChatContent(
    content: string,
    quest: string,
    id: number,
    modelRole: string,
  ) {
    return await this.prisma.chatContent.create({
      data: {
        content,
        role: '',
        quest,
        chatId: id,
        modelRole,
      },
    });
  }

  async insertChat(content: string, quest: string, modelRole: string) {
    return await this.prisma.chat.create({
      data: {
        title: quest,
        contents: {
          create: [
            {
              content,
              role: '',
              quest,
              modelRole,
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
