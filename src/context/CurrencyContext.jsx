import React, { createContext, useContext, useState } from "react";

const CurrencyContext = createContext({
    currency: "EUR",
    changeCurrency: () => { },
    formatPrice: (amount) => amount
});

export function CurrencyProvider({ children }) {
    const [currency, setCurrency] = useState(() => localStorage.getItem("jettura-currency") || "EUR");

    const changeCurrency = (curr) => {
        setCurrency(curr);
        localStorage.setItem("jettura-currency", curr);
        // Here you could later add conversion rates API logic
    };

    const formatPrice = (amount) => {
        return new Intl.NumberFormat(undefined, {
            style: "currency",
            currency: currency,
        }).format(amount);
    };

    return (
        <CurrencyContext.Provider value={{ currency, changeCurrency, formatPrice }}>
            {children}
        </CurrencyContext.Provider>
    );
}

export function useCurrency() {
    return useContext(CurrencyContext);
}
