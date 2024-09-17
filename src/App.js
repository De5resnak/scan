import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header/Header';
import Section1 from './components/Section1/Section1';
import CarouselSection from './components/CarouselSection/CarouselSection';
import Footer from './components/Footer/Footer';
import ImageBlock from "./components/ImageBlock/ImageBlock";
import PricingSection from "./components/TariffSection/PricingSection";
import LoginPage from './components/LoginPage/LoginPage';
import SearchPage from './components/SearchPage/SearchPage';
import ResultsPage from './components/ResultsPage/ResultsPage';
import { AuthProvider } from './AuthContext'; // Подключаем контекст
import PrivateRoute from './PrivateRoute'; // Подключаем защищенные маршруты

function App() {
  return (
    <AuthProvider> {/* Окружаем приложение контекстом авторизации */}
      <Router>
        <Header />
        <Routes>
          {/* Главная страница */}
          <Route
            path="/"
            element={
              <>
                <Section1 />
                <CarouselSection />
                <ImageBlock />
                <PricingSection />
              </>
            }
          />

          {/* Страница авторизации */}
          <Route path="/login" element={<LoginPage />} />

          {/* Защищенные маршруты */}
          <Route path="/search" element={<PrivateRoute element={SearchPage} />} />
          <Route path="/results" element={<PrivateRoute element={ResultsPage} />} />
        </Routes>
        <Footer />
      </Router>
    </AuthProvider>
  );
}

export default App;
