import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Slider from 'react-slick';
import image from '../../assets/images/resultspage.png';
import doc1 from '../../assets/images/document1.png'; // Эти данные можно будет заменить реальными
import doc2 from '../../assets/images/document2.png'; // Эти данные можно будет заменить реальными
import './ResultsPage.css';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { useAuth } from "../../AuthContext";


const ResultsPage = () => {

    const location = useLocation();
    const { histogramsData, documentIds } = location.state || {}; // Получаем гистограммы и ID документов
    const [documents, setDocuments] = useState([]); // Состояние для документов
    const [visibleCount, setVisibleCount] = useState(10); // Количество отображаемых документов
    const [loading, setLoading] = useState(false); // Состояние загрузки
    const [allDocumentsLoaded, setAllDocumentsLoaded] = useState(false); // Флаг завершения загрузки всех документов
    const { authData } = useAuth();




    useEffect(() => {
        console.log('Location state:', location.state); // Для диагностики
        if (documentIds && documentIds.length > 0) {
            loadDocuments(0, 10);
        }
    }, [documentIds]);

    // Функция для получения данных документов по их ID
    const fetchDocumentsData = async (ids) => {
    const response = await fetch('https://gateway.scan-interfax.ru/api/v1/documents', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${authData.accessToken}`, // Исправлено
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ids })
    });

    const data = await response.json();

    // Извлекаем только успешные документы
    const successfulDocs = data.map(item => item.ok).filter(doc => doc);

    return successfulDocs || [];
};

    // Функция для загрузки документов
    const loadDocuments = async (startIndex, count) => {
        setLoading(true); // Устанавливаем состояние загрузки
        const idsToFetch = documentIds.slice(startIndex, startIndex + count); // Получаем ID для загрузки
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

    // Функция для подсчета общего количества документов
    const calculateTotalDocuments = (histograms) => {
    let total = 0;

    // Добавляем проверку, что histograms - это массив
    if (Array.isArray(histograms)) {
        histograms.forEach(histogram => {
            if (histogram.histogramType === 'totalDocuments' && Array.isArray(histogram.data)) {
                histogram.data.forEach(item => {
                    total += item.value;
                });
            }
        });
    }

    return total;
};

    // Функция для преобразования данных в формат для отображения
    const getFormattedData = (histograms, histogramType) => {
    const histogram = histograms.find(h => h.histogramType === histogramType);
    return histogram
        ? histogram.data.sort((a, b) => new Date(a.date) - new Date(b.date))
        : [];
    };

    const totalDocuments = calculateTotalDocuments(histogramsData.data);
    const totalDocumentsData = getFormattedData(histogramsData.data, 'totalDocuments');
    const riskFactorsData = getFormattedData(histogramsData.data, 'riskFactors');

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
                <p className="ResultsPage-article-sub">Поиск может занять некоторое время, просим сохранять
                    терпение.</p>
            </div>
            <div className="ResultsPage-image-container">
                <img className="ResultsPage-image" src={image} alt="Results"/>
            </div>
            <div className="ResultsPage-article">
                <p className="ResultsPage-article-main">Общая сводка</p>
                <p className="ResultsPage-article-sub">Найдено {totalDocuments} документов</p>
            </div>

            {/* Слайдер с данными гистограммы */}
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

            {/* Отображение списка документов */}
            <div className="ResultsPage-documents-container">
                <div className="ResultsPage-documents-article-container">
                    <p className="ResultsPage-documents-article">Список документов</p>
                </div>
                {documents.map((doc, index) => (
                    <div key={index} className="ResultsPage-documents-card">
                        <div className='ResultsPage-documents-card-content'>
                            <div className='ResultsPage-documents-card-head'>
                                <p className="ResultsPage-documents-card-date">{new Date(doc.issueDate).toLocaleDateString()}</p>
                                <p className="ResultsPage-documents-card-source">{doc.source?.name}</p>
                            </div>
                            <p className="ResultsPage-documents-card-title">{doc.title?.text}</p>
                            <p className="ResultsPage-documents-card-text">{doc.content?.markup}</p>
                            <div className='ResultsPage-documents-card-button'>
                                <a href={doc.url}>
                                    Читать в источнике
                                </a>
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