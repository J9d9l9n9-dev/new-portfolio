import React, { useState, useEffect, useRef } from 'react';
import { content } from '../../data/content';
import { MessageSquareQuote, ChevronLeft, ChevronRight, Star, Quote } from 'lucide-react';

export const TestimonialsSection: React.FC = () => {
  if (!content.testimonials || content.testimonials.length === 0) {
    return null;
  }

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartX = useRef<number | null>(null);

  const prev = () => {
    setCurrentIndex((prevIdx) => (prevIdx === 0 ? content.testimonials.length - 1 : prevIdx - 1));
  };

  const next = () => {
    setCurrentIndex((prevIdx) => (prevIdx === content.testimonials.length - 1 ? 0 : prevIdx + 1));
  };

  // Keyboard navigation when focused or hovering
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') prev();
    if (e.key === 'ArrowRight') next();
  };

  // Touch swipe support
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (diff > 50) next();
    if (diff < -50) prev();
    touchStartX.current = null;
  };

  // Auto rotation with pause on hover
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      next();
    }, 6000);
    return () => clearInterval(interval);
  }, [isPaused]);

  const current = content.testimonials[currentIndex];

  return (
    <section
      id="testimonials"
      aria-label="Testimonials Section"
      className="py-20 px-4 sm:px-6 lg:px-8 relative"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      <div className="max-w-content mx-auto">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-14">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider text-primary bg-primary/10 border border-primary/20 mb-3">
            <MessageSquareQuote className="w-3.5 h-3.5" />
            <span>Endorsements & Recommendations</span>
          </div>
          <h2 className="font-display font-bold text-3xl sm:text-4xl text-text-primary tracking-tight">
            What Teammates <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Say</span>
          </h2>
          <p className="mt-2 text-text-secondary text-sm sm:text-base max-w-lg">
            Feedback and peer endorsements from engineering leads and academic advisors.
          </p>
          <div className="w-12 h-1 bg-gradient-to-r from-primary to-secondary rounded-full mt-3" />
        </div>

        {/* Carousel Card */}
        <div
          className="max-w-3xl mx-auto relative"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <div className="p-8 sm:p-12 rounded-3xl bg-bg-card border border-border shadow-lg relative overflow-hidden transition-all duration-300">
            <Quote className="absolute -bottom-6 -right-6 w-36 h-36 text-white/[0.03] pointer-events-none rotate-12" />

            {/* Star Rating */}
            <div className="flex items-center gap-1 mb-6 text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
              ))}
            </div>

            {/* Quote */}
            <p className="font-display text-lg sm:text-2xl text-text-primary font-medium leading-relaxed italic mb-8">
              "{current.quote}"
            </p>

            {/* Author Footer */}
            <div className="flex items-center justify-between pt-6 border-t border-border/50">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-primary to-secondary p-0.5 shadow-sm">
                  <div className="w-full h-full rounded-full bg-bg flex items-center justify-center font-display font-bold text-base text-primary">
                    {current.name.charAt(0)}
                  </div>
                </div>
                <div>
                  <h4 className="font-display font-bold text-base sm:text-lg text-text-primary">
                    {current.name}
                  </h4>
                  <p className="text-xs sm:text-sm text-text-muted">{current.role}</p>
                </div>
              </div>

              {/* Navigation Controls */}
              <div className="flex items-center gap-2">
                <button
                  onClick={prev}
                  aria-label="Previous testimonial"
                  className="p-2.5 rounded-full bg-white/5 border border-border hover:border-primary text-text-secondary hover:text-text-primary transition-colors focus:outline-none"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={next}
                  aria-label="Next testimonial"
                  className="p-2.5 rounded-full bg-white/5 border border-border hover:border-primary text-text-secondary hover:text-text-primary transition-colors focus:outline-none"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Dots Indicator */}
          <div className="flex justify-center items-center gap-2 mt-6">
            {content.testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentIndex(i)}
                aria-label={`Go to testimonial ${i + 1}`}
                className={`h-2 rounded-full transition-all duration-300 ${
                  currentIndex === i ? 'w-8 bg-primary' : 'w-2 bg-text-muted/40 hover:bg-text-muted'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
