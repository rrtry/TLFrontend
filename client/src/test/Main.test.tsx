import { render, screen, fireEvent } from '@testing-library/react';
import { Main } from '../pages/Main/Main';

describe('Конвертер', () => {
  it('рендерит селекты и поля с мок-данными', () => {
    render(<Main />);
    
    // Поле ввода суммы
    const amountInput = screen.getByTestId('amount-input');
    expect(amountInput).toHaveValue(1);
    
    // Поле результата
    const resultInput = screen.getByTestId('result-input');
    expect(resultInput).toBeInTheDocument();
    
    // Селекты по test-id
    const fromSelect = screen.getByTestId('from-select');
    const toSelect = screen.getByTestId('to-select');
    expect(fromSelect).toHaveValue('CAD'); // первая валюта по умолчанию
    expect(toSelect).toHaveValue('PLN');   // вторая валюта
    
    // Кнопка Swap
    expect(screen.getByTestId('swap-button')).toBeInTheDocument();
  });

  it('пересчитывает результат при изменении суммы', () => {
    render(<Main />);
    const amountInput = screen.getByTestId('amount-input');
    fireEvent.change(amountInput, { target: { value: '10' } });
    
    const resultInput = screen.getByTestId('result-input');
    // CAD -> PLN курс 2.95, 10 * 2.95 = 29.5
    const expected = 29.5;
    expect(resultInput).toHaveValue(expected);
  });

  it('пересчитывает результат при изменении пары валют', () => {
    render(<Main />);
    const fromSelect = screen.getByTestId('from-select');
    fireEvent.change(fromSelect, { target: { value: 'AUD' } });
    
    const resultInput = screen.getByTestId('result-input');
    // AUD -> PLN курс 2.66, сумма 1
    const expected = 2.66;
    expect(resultInput).toHaveValue(expected);
  });

  it('запрещает одинаковые валюты в паре', () => {
    render(<Main />);
    const fromSelect = screen.getByTestId('from-select');
    // Пытаемся выбрать PLN (текущая to-валюта)
    fireEvent.change(fromSelect, { target: { value: 'PLN' } });
    
    // to должен автоматически смениться на первую доступную отличную от PLN (это CAD)
    const toSelect = screen.getByTestId('to-select');
    expect(toSelect).toHaveValue('CAD');
    // Проверяем, что from и to не одинаковы
    expect(fromSelect).toHaveValue('PLN');
    expect(toSelect).not.toHaveValue('PLN');
  });

  it('сбрасывает состояние MoreAbout при смене пары (через key)', () => {
    render(<Main />);
    
    // Открываем описание пары (общая кнопка)
    const moreAboutButton = screen.getByTestId('more-about-header');
    fireEvent.click(moreAboutButton);
    
    // Должны появиться описания для CAD и PLN
    const descCad = screen.getByTestId('description-CAD');
    const descPln = screen.getByTestId('description-PLN');
    expect(descCad).toBeInTheDocument();
    expect(descPln).toBeInTheDocument();
    
    // Меняем пару: from CAD -> AUD
    const fromSelect = screen.getByTestId('from-select');
    fireEvent.change(fromSelect, { target: { value: 'AUD' } });
    
    // Описание CAD и PLN должно исчезнуть, а описание AUD не должно появиться (сброс состояния)
    expect(screen.queryByTestId('description-CAD')).not.toBeInTheDocument();
    expect(screen.queryByTestId('description-PLN')).not.toBeInTheDocument();
    expect(screen.queryByTestId('description-AUD')).not.toBeInTheDocument();
  });

  it('переключает видимость описаний валют при клике на More about', () => {
    render(<Main />);
    // Изначально описаний нет
    expect(screen.queryByTestId('description-CAD')).not.toBeInTheDocument();
    expect(screen.queryByTestId('description-PLN')).not.toBeInTheDocument();

    // Открываем описания
    const toggleButton = screen.getByTestId('more-about-header');
    fireEvent.click(toggleButton);

    // Оба описания появились
    expect(screen.getByTestId('description-CAD')).toBeInTheDocument();
    expect(screen.getByTestId('description-PLN')).toBeInTheDocument();

    // Закрываем обратно
    fireEvent.click(toggleButton);

    // Описания исчезли
    expect(screen.queryByTestId('description-CAD')).not.toBeInTheDocument();
    expect(screen.queryByTestId('description-PLN')).not.toBeInTheDocument();
  });
});