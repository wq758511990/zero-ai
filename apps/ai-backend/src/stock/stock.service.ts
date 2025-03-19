import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

@Injectable()
export class StockService {
  constructor(private configService: ConfigService) {}

  private readonly apiKey = this.configService.get<string>(
    'ALPHA_VANTAGE_API_KEY',
  );
  private readonly baseUrl = 'https://www.alphavantage.co/query';

  async getStockData(symbol: string) {
    try {
      const response = await axios.get(this.baseUrl, {
        params: {
          function: 'TIME_SERIES_DAILY',
          symbol,
          apikey: this.apiKey,
        },
      });
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch stock data: ${error.message}`);
    }
  }

  async getStockOverview(symbol: string) {
    try {
      const response = await axios.get(this.baseUrl, {
        params: {
          function: 'OVERVIEW',
          symbol,
          apikey: this.apiKey,
        },
      });
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch stock overview: ${error.message}`);
    }
  }
}
