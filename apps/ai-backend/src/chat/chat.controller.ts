import { Controller, Get, Inject, Query, Sse } from '@nestjs/common';
import { Observable, Subject, tap } from 'rxjs';
import { ChatService } from './chat.service';

type BufferType = { type: string; content: string | number };

@Controller('chat')
export class ChatController {
  @Inject(ChatService)
  private chatService: ChatService;

  @Sse('base')
  async chat(
    @Query('msg') msg: string,
    @Query('model') model: string,
    @Query('id') id?: number,
    @Query('role') role?: string,
  ): Promise<Observable<BufferType>> {
    const stream$ = await this.chatService.createResponseStream(
      msg,
      model,
      id,
      role,
    );
    // 使用一个 Subject 来缓冲流数据
    const buffer$ = new Subject<BufferType>();

    this.addRecord(stream$, buffer$, msg, id, role);

    return buffer$.asObservable();
  }

  addRecord(
    stream: Observable<string>,
    buffer: Subject<BufferType>,
    quest: string,
    id: number,
    role: string,
  ) {
    let completeContent = '';
    console.log('id', id);
    stream
      .pipe(
        tap({
          next: (chunk) => {
            completeContent += chunk;
            buffer.next({ type: 'content', content: chunk });
          },
          error: (err) => {
            console.error('Stream error:', err);
            buffer.error(err);
          },
          complete: async () => {
            // 有传id则插入新的问答内容，没有则创建新的会话
            let sessionId: number;
            try {
              if (id) {
                await this.chatService.insertChatContent(
                  completeContent,
                  quest,
                  id,
                  role,
                );
              } else {
                const response = await this.chatService.insertChat(
                  completeContent,
                  quest,
                  role,
                );
                sessionId = response.id;
              }
              buffer.next({ type: 'session', content: sessionId });
              buffer.complete();
            } catch (err) {
              console.error('Error saving to database:', err);
              buffer.error(err);
            }
          },
        }),
      )
      .subscribe();
  }

  @Get('list')
  async getChatList() {
    return await this.chatService.findAllList();
  }

  @Get('contentList')
  async getContentList(@Query('id') id: number) {
    return await this.chatService.findContents(id);
  }
}
