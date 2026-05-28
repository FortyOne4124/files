import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

/* Слайды: четыре изображения из папки images/ (publicDir) */
const SLIDES = [
  { src: '/collage1.jpeg', alt: 'Банкетный зал' },
  { src: '/collage2.jpeg', alt: 'Ресторан' },
  { src: '/collage3.jpeg', alt: 'Летняя веранда' },
  { src: '/collage4.jpeg', alt: 'Закрытая веранда' },
];

const Slider = () => {
  const [current, setCurrent]   = useState(0);
  const intervalRef             = useRef(null);

  /* Автоматическое переключение каждые 3 секунды */
  const startAutoPlay = () => {
    intervalRef.current = setInterval(() => {
      setCurrent((prev) => (prev + 1) % SLIDES.length);
    }, 3000);
  };

  useEffect(() => {
    startAutoPlay();
    return () => clearInterval(intervalRef.current);
  }, []);

  /* Ручное переключение сбрасывает таймер */
  const goTo = (index) => {
    clearInterval(intervalRef.current);
    setCurrent(index);
    startAutoPlay();
  };

  const prev = () => goTo((current - 1 + SLIDES.length) % SLIDES.length);
  const next = () => goTo((current + 1) % SLIDES.length);

  return (
    <div className="slider">
      {/* Трек со слайдами */}
      <div
        className="slider-track"
        style={{ transform: `translateX(-${current * 100}%)` }}
      >
        {SLIDES.map((slide, i) => (
          <img
            key={i}
            src={slide.src}
            alt={slide.alt}
            className="slider-slide"
          />
        ))}
      </div>

      {/* Кнопки навигации */}
      <button className="slider-btn prev" onClick={prev} aria-label="Назад">
        <ChevronLeft size={20} />
      </button>
      <button className="slider-btn next" onClick={next} aria-label="Вперёд">
        <ChevronRight size={20} />
      </button>

      {/* Индикаторные точки */}
      <div className="slider-dots">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            className={`slider-dot${i === current ? ' active' : ''}`}
            onClick={() => goTo(i)}
            aria-label={`Слайд ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default Slider;
