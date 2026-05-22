import { useState, useEffect, useCallback } from 'react';
import { currencies } from '../mocks/currencies';
import { priceChanges } from '../mocks/priceChanges';

export const useConverter = () => {

    const currencyCodes = currencies.map(c => c.code);
    const [from, setFrom] = useState<string>(currencyCodes[0]);
    const [to, setTo] = useState<string>(currencyCodes[1]);

    const [amount, setAmount] = useState<number>(1);
    const [result, setResult] = useState<number>(0);

    // Запрет одинаковых валют: если from === to, автоматически меняем to
    useEffect(() => {
        if (from === to) {
            const newTo = currencyCodes.find(code => code !== from) || currencyCodes[0];
            setTo(newTo);
        }
    }, [from, to, currencyCodes]);
    
    const getRate = useCallback((): number => {
        if (!priceChanges[from]?.[to]) {
            return 0;
        }
        return priceChanges[from][to].price;
    }, [from, to]);

    useEffect(() => {
        const rate = getRate();
        setResult(amount * rate);
    }, [amount, getRate]);

    const swap = useCallback(() => {
        setFrom(to);
        setTo(from);
    }, [from, to]);

    return {
        from,
        to,
        amount,
        result,
        setFrom,
        setTo,
        setAmount,
        swap,
        getRate,
    };
};