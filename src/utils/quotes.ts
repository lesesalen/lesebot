import { format } from "date-fns";
import path from "path";

import { Quote } from "../types";
import { loadJson } from "./utils";

export const QUOTES_PATH = path.resolve(process.cwd(), "data/quotes.json");
export const ADDED_QUOTES_PATH = path.resolve(process.cwd(), "data/added_quotes.json");

export const loadQuotes = async (): Promise<Quote[]> => {
  return await loadJson(QUOTES_PATH);
};

export const loadAddedQuotes = async (): Promise<Quote[]> => {
  return await loadJson(ADDED_QUOTES_PATH);
};

export const loadMergedQuotes = async (): Promise<Quote[]> => {
  const q1 = await loadQuotes();
  const q2 = await loadAddedQuotes();

  return [...q1, ...q2];
};

export const formatQuote = (quote: Quote): string => {
  const date = format(new Date(quote.date), "do MMMM yyyy");

  return `${quote.quote} -- ${quote.author} (${date})`;
};
