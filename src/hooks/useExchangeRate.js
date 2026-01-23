import { useCurrency } from "../context/CurrencyContext";

export function useExchangeRate(euroAmount) {
  const { currency } = useCurrency();

  // Simulierter Wechselkurs: 1 EUR = 1.10 USD
  const rate = currency === "USD" ? 1.1 : 1;
  const converted = (euroAmount * rate).toFixed(2);

  return {
    price: converted,
    symbol: currency === "USD" ? "$" : "€"
  };
}