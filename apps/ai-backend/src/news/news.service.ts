import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

@Injectable()
export class NewsService {
  constructor(private configService: ConfigService) {}

  private readonly apiKey = this.configService.get<string>('NEWS_API_KEY');
  private readonly baseUrl = 'https://newsapi.org/v2';

  async getStockNews(symbol: string) {
    try {
      const response = await axios.get(`${this.baseUrl}/everything`, {
        params: {
          q: `${symbol} stock`,
          sortBy: 'publishedAt',
          apiKey: this.apiKey,
        },
      });
      return response.data.articles;
    } catch (error) {
      throw new Error(`Failed to fetch news: ${error.message}`);
    }
  }
}
