import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Slider from 'react-slick';
import image from '../../assets/images/resultspage.png';
import doc1 from '../../assets/images/document1.png'; // Эти данные можно будет заменить реальными
import doc2 from '../../assets/images/document2.png'; // Эти данные можно будет заменить реальными
import './ResultsPage.css';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const ResultsPage = () => {
    const location = useLocation();
    const { result } = location.state || {}; // Получаем результат из состояния
    const [documents, setDocuments] = useState([]); // Состояние для документов
    const [visibleCount, setVisibleCount] = useState(10); // Количество отображаемых документов
    const [loading, setLoading] = useState(false); // Состояние загрузки
    const [allDocumentsLoaded, setAllDocumentsLoaded] = useState(false); // Флаг завершения загрузки всех документов

    useEffect(() => {
        if (result) {
            loadDocuments(0, 10); // Загружаем первые 10 документов
        }
    }, [result]);

    // Функция для получения ID документов
    const fetchDocumentIds = async () => {
        const response = await fetch('/api/objectsearch', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ /* Параметры поиска */ })
        });
        const data = await response.json();
        return data.ids || []; // Предположим, что ID документов приходят в поле ids
    };

    // Функция для получения данных документов по их ID
    const fetchDocumentsData = async (ids) => {
        const response = await fetch('/api/documents', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ids })
        });
        const data = await response.json();
        return data.documents || []; // Предположим, что документы приходят в поле documents
    };

    // Функция для загрузки документов
    const loadDocuments = async (startIndex, count) => {
        setLoading(true); // Устанавливаем состояние загрузки
        const ids = await fetchDocumentIds();
        const idsToFetch = ids.slice(startIndex, startIndex + count); // Получаем ID для загрузки
        const newDocuments = await fetchDocumentsData(idsToFetch);

        setDocuments(prevDocs => [...prevDocs, ...newDocuments]); // Добавляем новые документы
        setVisibleCount(prevCount => prevCount + newDocuments.length); // Обновляем количество видимых документов
        if (newDocuments.length < count) {
            setAllDocumentsLoaded(true); // Если меньше, чем требуемое количество документов, все документы загружены
        }
        setLoading(false); // Снимаем состояние загрузки
    };

    // Обработчик нажатия кнопки «Показать больше»
    const handleShowMore = () => {
        loadDocuments(visibleCount, 10); // Загружаем следующие 10 документов
    };

    // Если данных нет


    // Функция для подсчета общего количества документов
    const calculateTotalDocuments = (data) => {
        let total = 0;
        data.forEach(histogram => {
            if (histogram.histogramType === 'totalDocuments') {
                histogram.data.forEach(item => {
                    total += item.value;
                });
            }
        });
        return total;
    };

    // Функция для преобразования данных в формат для отображения
    const getFormattedData = (histogramType) => {
        const histogram = result.data.find(h => h.histogramType === histogramType);
        return histogram ? histogram.data : [];
    };

    const totalDocuments = calculateTotalDocuments(result.data);
    const totalDocumentsData = getFormattedData('totalDocuments');
    const riskFactorsData = getFormattedData('riskFactors');

    // Объединяем данные для отображения в карусели
    const dataMap = totalDocumentsData.map(item => ({
        date: item.date,
        total: item.value,
        risk: riskFactorsData.find(r => r.date === item.date)?.value || 0
    }));

    const settings = {
        dots: false,
        infinite: false,
        speed: 500,
        slidesToShow: 5,
        slidesToScroll: 1,
        responsive: [
            {
                breakpoint: 768, // При ширине экрана 768px и меньше
                settings: {
                    slidesToShow: 1, // Показываем 1 слайд на мобильных
                    slidesToScroll: 1
                }
            }
        ],
    };

    return (
        <section className="ResultsPage">
            <div className="ResultsPage-article">
                <p className="ResultsPage-article-main">Ищем. Скоро будут результаты</p>
                <p className="ResultsPage-article-sub">Поиск может занять некоторое время, просим сохранять терпение.</p>
            </div>
            <div className="ResultsPage-image-container">
                <img className="ResultsPage-image" src={image} alt="Results" />
            </div>

            <div className="ResultsPage-breaf-container">
                <div className="ResultsPage-breaf-article-container">
                    <p className="ResultsPage-breaf-article-main">Общая сводка</p>
                    <p className='ResultsPage-breaf-article-sub'>Найдено {totalDocuments} вариантов</p>
                </div>

                <div className="ResultsPage-breaf">
                    <div className="ResultsPage-breaf-labels">
                        <p>Период</p>
                        <p>Всего</p>
                        <p>Риски</p>
                    </div>
                    <div className="ResultsPage-breaf-slider-container">
                        <Slider {...settings} className="ResultsPage-breaf-slider">
                            {dataMap.map((item, index) => (
                                <div key={index} className="ResultsPage-breaf-slide">
                                    <div className="ResultsPage-breaf-column">
                                        <p>{new Date(item.date).toLocaleDateString()}</p>
                                    </div>
                                    <div className="ResultsPage-breaf-column">
                                        <p>{item.total}</p>
                                    </div>
                                    <div className="ResultsPage-breaf-column">
                                        <p>{item.risk}</p>
                                    </div>
                                </div>
                            ))}
                        </Slider>
                    </div>
                </div>
            </div>

            <div className="ResultsPage-documents-container">
                <div className="ResultsPage-documents-article-container">
                    <p className="ResultsPage-documents-article">Список документов</p>
                </div>
                {documents.map((doc, index) => (
                    <div key={index} className="ResultsPage-documents-card">
                        <div className='ResultsPage-documents-card-content'>
                            <div className='ResultsPage-documents-card-head'>
                                <p className="ResultsPage-documents-card-date">{doc.date}</p>
                                <p className="ResultsPage-documents-card-source">{doc.source}</p>
                            </div>
                            <p className="ResultsPage-documents-card-title">{doc.title}</p>
                            <div className="ResultsPage-documents-card-type">{doc.type}</div>
                            <div className="ResultsPage-documents-card-image-container">
                                <img className='ResultsPage-documents-card-image' src={doc.image || doc1} alt="Document" />
                            </div>
                            <p className="ResultsPage-documents-card-text">{doc.text}</p>
                            <div className='ResultsPage-documents-card-button-container'>
                                <button className='ResultsPage-documents-card-button'>Читать в источнике</button>
                            </div>
                        </div>
                    </div>
                ))}

                {!allDocumentsLoaded && (
                    <div className="ResultsPage-ShowMore-button-container">
                        <button className="ResultsPage-ShowMore-button" onClick={handleShowMore}>
                            {loading ? 'Загрузка...' : 'Показать больше'}
                        </button>
                    </div>
                )}
            </div>
        </section>
    );
};

export default ResultsPage;