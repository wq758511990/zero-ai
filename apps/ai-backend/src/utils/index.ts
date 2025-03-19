import * as crypto from 'crypto';

export function md5(str) {
  const hash = crypto.createHash('md5');
  hash.update(str);
  return hash.digest('hex');
}

export const getStockPrompt = (
  stockCode: string,
  stockOverview: any,
  news: any,
) => {
  const prompt = `
  Please analyze the following stock data and news for ${stockCode}:
  
  Stock Overview:
  ${JSON.stringify(stockOverview)}
  
  Recent News Headlines:
  ${news
    .slice(0, 5)
    .map((n) => n.title)
    .join('\n')}
  
  Based on the technical analysis, fundamental data, and recent news:
  1. What is the current trend?
  2. What are the key risk factors?
  3. What is your investment recommendation?
  4. What is the target price range?
  
  Please provide a detailed but concise analysis.
  用汉语给出最终结果
`;

  return prompt;
};
