import { Module } from '@nestjs/common';
import { NewsModule } from 'src/news/news.module';
import { StockModule } from 'src/stock/stock.module';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';

@Module({
  providers: [ChatService],
  exports: [ChatService],
  controllers: [ChatController],
  imports: [StockModule, NewsModule],
})
export class ChatModule {}
