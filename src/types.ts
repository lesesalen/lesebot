export interface Quote {
  quote: string;
  author: string;
  date: Date;
}

export interface RandomGenerateIntegers {
  jsonrpc: string;
  result: {
    random: {
      data: Array<number>;
      completionTime: string;
    };
    bitsUsed: number;
    bitsLeft: number;
    requestsLeft: number;
    advisoryDelay: number;
  };
  id: number;
}
