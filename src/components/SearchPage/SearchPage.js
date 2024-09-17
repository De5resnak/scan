import React, { useState, useEffect } from 'react';
import './SearchPage.css';
import img1 from '../../assets/images/searchpage1.png';
import img2 from '../../assets/images/searchpage2.png';
import img3 from '../../assets/images/searchpage3.png';
import { useNavigate } from 'react-router-dom'; // Для перенаправления на другую страницу
import { useAuth } from "../../AuthContext";

// Функция для валидации ИНН
function validateInn(inn, error) {
    var result = false;

    if (typeof inn === 'number') {
        inn = inn.toString();
    } else if (typeof inn !== 'string') {
        inn = '';
    }

    // Удаляем пробелы из строки
    inn = inn.replace(/\s+/g, '');

    if (!inn.length) {
        error.code = 1;
        error.message = 'ИНН пуст';
    } else if (/[^0-9]/.test(inn)) {
        error.code = 2;
        error.message = 'ИНН может состоять только из цифр';
    } else if ([10, 12].indexOf(inn.length) === -1) {
        error.code = 3;
        error.message = 'ИНН может состоять только из 10 или 12 цифр';
    } else {
        var checkDigit = function (inn, coefficients) {
            var n = 0;
            for (var i in coefficients) {
                n += coefficients[i] * inn[i];
            }
            return parseInt(n % 11 % 10);
        };
        switch (inn.length) {
            case 10:
                var n10 = checkDigit(inn, [2, 4, 10, 3, 5, 9, 4, 6, 8]);
                if (n10 === parseInt(inn[9])) {
                    result = true;
                }
                break;
            case 12:
                var n11 = checkDigit(inn, [7, 2, 4, 10, 3, 5, 9, 4, 6, 8]);
                var n12 = checkDigit(inn, [3, 7, 2, 4, 10, 3, 5, 9, 4, 6, 8]);
                if ((n11 === parseInt(inn[10])) && (n12 === parseInt(inn[11]))) {
                    result = true;
                }
                break;
        }
        if (!result) {
            error.code = 4;
            error.message = 'Неправильное контрольное число';
        }
    }

    return result;
}

const SearchPage = () => {
    const [inn, setInn] = useState(''); // Для хранения значения ИНН
    const [innError, setInnError] = useState(''); // Для хранения ошибки ИНН
    const [startDate, setStartDate] = useState(''); // Для хранения начальной даты
    const [endDate, setEndDate] = useState(''); // Для хранения конечной даты
    const [dateError, setDateError] = useState(''); // Для хранения ошибки по датам
    const [isFormValid, setIsFormValid] = useState(false); // Для блокировки кнопки
    const [tone, setTone] = useState('any'); // Тональность
    const [documentsCount, setDocumentsCount] = useState(10); // Количество документов в выдаче
    const navigate = useNavigate(); // Используем для перенаправления
    const { authData } = useAuth();
    const [checkboxes, setCheckboxes] = useState({
        fullness: false,
        businessContext: false,
        mainRole: false,
        riskFactors: false,
        technicalNews: false,
        announcements: false,
        newsDigests: false,
    });

    // Валидация при изменении ИНН
    const handleInnChange = (e) => {
        const newInn = e.target.value;
        setInn(newInn);

        const error = { code: null, message: '' };
        if (!validateInn(newInn, error)) {
            setInnError(error.message);
        } else {
            setInnError('');
        }
    };

    // Валидация диапазона дат при изменении
    const handleDateChange = (start, end) => {
        setStartDate(start);
        setEndDate(end);

        const startParsed = new Date(start);
        const endParsed = new Date(end);

        if (start && end && startParsed >= endParsed) {
            setDateError('Дата начала должна быть меньше даты окончания');
        } else {
            setDateError('');
        }
    };

    // Функция проверки валидности всей формы
    useEffect(() => {
        const validateForm = () => {
            const error = { code: null, message: '' };
            const start = new Date(startDate);
            const end = new Date(endDate);

            // Проверяем, заполнены ли все обязательные поля и валидны ли они
            if (!inn || !validateInn(inn, error) || !startDate || !endDate || start >= end) {
                setIsFormValid(false);
            } else {
                setIsFormValid(true);
            }
        };

        validateForm();
    }, [inn, startDate, endDate]);

    const handleSubmit = async (e) => {
    e.preventDefault();

    const error = { code: null, message: '' };

    // Валидируем ИНН перед отправкой формы
    if (!validateInn(inn, error)) {
        setInnError(error.message);
        return;
    } else {
        setInnError('');
    }

    // Валидируем диапазон дат
    const start = new Date(startDate);
    const end = new Date(endDate);
    if (start >= end) {
        setDateError('Дата начала должна быть меньше даты окончания');
        return;
    } else {
        setDateError('');
    }

    // Преобразуем даты в ISO-формат
    const formattedStartDate = new Date(startDate).toISOString();
    const formattedEndDate = new Date(endDate).toISOString();

    // Формируем тело запроса с учетом правок
    const requestBody = {
        intervalType: "month", // Значение по требованию
        histogramTypes: ["totalDocuments", "riskFactors"], // Оба значения
        issueDateInterval: {
            startDate: formattedStartDate,
            endDate: formattedEndDate
        },
        searchContext: {
            targetSearchEntitiesContext: {
                targetSearchEntities: [{ type: "company", inn: inn }],
                onlyMainRole: checkboxes.mainRole,
                tonality: tone === 'any' ? null : tone,
                onlyWithRiskFactors: checkboxes.riskFactors,
                themes: {
                    and: [],
                    or: [],
                    not: []
                }
            },
            searchEntitiesFilter: { and: [], or: [], not: [] },
            locationsFilter: { and: [], or: [], not: [] },
            themesFilter: { and: [], or: [], not: [] }
        },
        similarMode: "none", // Выбрано значение "none"
        limit: documentsCount, // Лимит количества документов
        sortType: "issueDate", // Можно изменить на "sourceInfluence"
        sortDirectionType: "desc", // Направление сортировки
        attributeFilters: {
            excludeTechNews: checkboxes.technicalNews,
            excludeAnnouncements: checkboxes.announcements,
            excludeDigests: checkboxes.newsDigests
        }
    };

    try {
        const response = await fetch('https://gateway.scan-interfax.ru/api/v1/objectsearch/histograms', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${authData.accessToken}`, // Исправлено
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody),
        });

        if (!response.ok) {
            throw new Error('Ошибка при выполнении поиска');
        }

        const result = await response.json();

        // Перенаправляем на страницу с результатами
        navigate('/results', { state: { result } });

    } catch (err) {
        console.error('Ошибка:', err);
    }
};


    const handleCheckboxChange = (e) => {
        setCheckboxes({
            ...checkboxes,
            [e.target.name]: e.target.checked,
        });
    };

    return (
        <section className="SearchPage">
            <div className='SearchPage-content'>
                <div className="SearchPage-article">
                    <p className='SearchPage-article-main'>Найдите необходимые данные в пару кликов</p>
                    <p className='SearchPage-article-sub'>Задайте параметры поиска. Чем больше заполните, тем точнее поиск</p>
                </div>
                <div className="SearchPage-form-container">
                    <form className='SearchPage-form' onSubmit={handleSubmit}>
                        <div className='SearchPage-form-main'>
                            <article className='SearchPage-form-article'>ИНН компании<sup>*</sup></article>
                            <input
                                className='SearchPage-form-input'
                                required
                                placeholder="10 цифр"
                                value={inn}
                                onChange={handleInnChange} // Исправлено
                            />
                            {innError && <p className="SearchPage-form-error">{innError}</p>}

                            <article className='SearchPage-form-article'>Тональность</article>
                            <select
                                className='SearchPage-form-select'
                                value={tone}
                                onChange={(e) => setTone(e.target.value)}
                            >
                                <option value="any" className='SearchPage-form-select-option'>Любая</option>
                                <option value="negative" className='SearchPage-form-select-option'>Негативная</option>
                                <option value="positive" className='SearchPage-form-select-option'>Позитивная</option>
                            </select>

                            <article className='SearchPage-form-article'>Количество документов в выдаче<sup>*</sup></article>
                            <input
                                className='SearchPage-form-input'
                                type='number'
                                min='0'
                                max='1000'
                                placeholder="От 1 до 1000"
                                required
                                value={documentsCount}
                                onChange={(e) => setDocumentsCount(e.target.value)}
                            />

                            <article className='SearchPage-form-article'>Диапазон поиска<sup>*</sup></article>
                            <div className="SearchPage-form-range-section">
                                <input
                                    className='SearchPage-form-input-date'
                                    type='date'
                                    required
                                    placeholder="Дата начала"
                                    value={startDate}
                                    onChange={(e) => handleDateChange(e.target.value, endDate)} // Исправлено
                                />
                                <input
                                    className='SearchPage-form-input-date'
                                    type='date'
                                    required
                                    placeholder="Дата конца"
                                    value={endDate}
                                    onChange={(e) => handleDateChange(startDate, e.target.value)} // Исправлено
                                />
                            </div>
                            {dateError && <p className="SearchPage-form-error">{dateError}</p>}
                        </div>

                        <div className='SearchPage-form-checkbox-container'>
                            <label className='SearchPage-form-article'>
                                <input
                                    className='SearchPage-form-input-radio'
                                    type='checkbox'
                                    name='fullness'
                                    checked={checkboxes.fullness}
                                    onChange={handleCheckboxChange}
                                />
                                Признак максимальной полноты
                            </label>
                            <label className='SearchPage-form-article'>
                                <input
                                    className='SearchPage-form-input-radio'
                                    type='checkbox'
                                    name='businessContext'
                                    checked={checkboxes.businessContext}
                                    onChange={handleCheckboxChange}
                                />
                                Упоминания в бизнес-контексте
                            </label>
                            <label className='SearchPage-form-article'>
                                <input
                                    className='SearchPage-form-input-radio'
                                    type='checkbox'
                                    name='mainRole'
                                    checked={checkboxes.mainRole}
                                    onChange={handleCheckboxChange}
                                />
                                Главная роль в публикации
                            </label>
                            <label className='SearchPage-form-article'>
                                <input
                                    className='SearchPage-form-input-radio'
                                    type='checkbox'
                                    name='riskFactors'
                                    checked={checkboxes.riskFactors}
                                    onChange={handleCheckboxChange}
                                />
                                Публикации только с риск-факторами
                            </label>
                            <label className='SearchPage-form-article'>
                                <input
                                    className='SearchPage-form-input-radio'
                                    type='checkbox'
                                    name='technicalNews'
                                    checked={checkboxes.technicalNews}
                                    onChange={handleCheckboxChange}
                                />
                                Включать технические новости рынков
                            </label>
                            <label className='SearchPage-form-article'>
                                <input
                                    className='SearchPage-form-input-radio'
                                    type='checkbox'
                                    name='announcements'
                                    checked={checkboxes.announcements}
                                    onChange={handleCheckboxChange}
                                />
                                Включать анонсы и календари
                            </label>
                            <label className='SearchPage-form-article'>
                                <input
                                    className='SearchPage-form-input-radio'
                                    type='checkbox'
                                    name='newsDigests'
                                    checked={checkboxes.newsDigests}
                                    onChange={handleCheckboxChange}
                                />
                                Включать сводки новостей
                            </label>
                        </div>

                        <div className='SearchPage-form-button-container'>
                            <button
                                className={`SearchPage-form-button ${!isFormValid ? 'SearchPage-form-button-disabled' : ''}`}
                                type='submit'
                                disabled={!isFormValid}
                            >
                                Поиск
                            </button>
                            <article className='SearchPage-form-article-mark'><sup>*</sup>Обязательные к заполнению поля
                            </article>
                        </div>
                    </form>
                </div>
            </div>
            <div className='SearchPage-image-container'>
                <img src={img1} id='SearchPage-image1' alt='search1' />
                <img src={img2} id='SearchPage-image2' alt='search2' />
                <img src={img3} id='SearchPage-image3' alt='search3' />
            </div>
        </section>
    );
};

export default SearchPage;