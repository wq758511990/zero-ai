// 定义接口数据类型
export interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
}
