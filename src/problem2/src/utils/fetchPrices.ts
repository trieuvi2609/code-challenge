import axios from "axios";

export interface TokenPrice {
  currency: string;
  price: number;
  date: string;
}

export const fetchTokenPrices = async (): Promise<TokenPrice[]> => {
  const response = await axios.get("https://interview.switcheo.com/prices.json");
  return getLatestTokenPrices(response.data);
};

export const getLatestTokenPrices = (tokenData: TokenPrice[]): TokenPrice[] => {
  const tokenMap = new Map<string, TokenPrice>();

  tokenData.forEach((token) => {
    const existingToken = tokenMap.get(token.currency);

    if (
      !existingToken || 
      new Date(token.date) > new Date(existingToken.date) || 
      (new Date(token.date).getTime() === new Date(existingToken.date).getTime() && token.price !== existingToken.price)
    ) {
      tokenMap.set(token.currency, token);
    }
  });

  return Array.from(tokenMap.values()).filter((token) => token.price);
};