import { render, screen } from '@testing-library/react';
import { MoreAbout } from './MoreAbout';
import { currencies } from '../../data/currencyData';

describe('MoreAbout Component', () => {

    const fromCurrency = currencies.PLN;
    const toCurrency = currencies.JPY;

    it('Редеринг', () => {
        render(<MoreAbout fromCurrency={fromCurrency} toCurrency={toCurrency} />);
        expect(screen.getByText(/PLN\/JPY: about ↑/)).toBeInTheDocument();
    });

    it('Корректный разделитель', () => {
        render(<MoreAbout fromCurrency={fromCurrency} toCurrency={toCurrency} />);
        const separatorText = screen.getByText('PLN/JPY: about ↑');
        expect(separatorText).toBeInTheDocument();
    });

    it('Информация для валюты из которой переводим', () => {
        render(<MoreAbout fromCurrency={fromCurrency} toCurrency={toCurrency} />);
        expect(screen.getByText('Polish zloty - PLN - zł')).toBeInTheDocument();
        expect(screen.getByText(/official currency and legal tender of Poland/i)).toBeInTheDocument();
    });

    it('Информация для валюты в которую переводим', () => {
        render(<MoreAbout fromCurrency={fromCurrency} toCurrency={toCurrency} />);
        expect(screen.getByText('Japanese yen - JPY - ¥')).toBeInTheDocument();
        expect(screen.getByText(/third-most traded currency in the foreign exchange market/i)).toBeInTheDocument();
    });

    it('Совпадение описаний валют', () => {
        render(<MoreAbout fromCurrency={fromCurrency} toCurrency={toCurrency} />);
        expect(screen.getByText(fromCurrency.description)).toBeInTheDocument();
        expect(screen.getByText(toCurrency.description)).toBeInTheDocument();
    });

    it('2 Информационных блока', () => {
        render(<MoreAbout fromCurrency={fromCurrency} toCurrency={toCurrency} />);
        const headings = screen.getAllByRole('heading', { level: 3 });
        expect(headings).toHaveLength(2);
        expect(headings[0]).toHaveTextContent('Polish zloty - PLN - zł');
        expect(headings[1]).toHaveTextContent('Japanese yen - JPY - ¥');
    });
});