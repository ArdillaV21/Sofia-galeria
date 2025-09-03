"use client";

import type React from "react";

import Image from "next/image";
import {
  Instagram,
  Phone,
  ChevronLeft,
  ChevronRight,
  Send,
} from "lucide-react";
import { useState, useRef } from "react";

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  const sliderRef = useRef<HTMLDivElement>(null);

  const [touchStart, setTouchStart] = useState<{ x: number; y: number } | null>(
    null
  );
  const [touchEnd, setTouchEnd] = useState<{ x: number; y: number } | null>(
    null
  );
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);
  const [isHorizontalSwipe, setIsHorizontalSwipe] = useState<boolean | null>(
    null
  );

  const [formData, setFormData] = useState({
    message: "",
    name: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const sliderImages = [
    {
      src: "/images/woman-megaphone.jpg",
      alt: "Woman with megaphone",
      title: "Evocación Urbana",
      description:
        "Registro fotográfico que forma parte de un proyecto artístico teatral",
    },
    {
      src: "/images/evocacion-woman.jpg",
      alt: "Woman smiling",
      title: "Retrato Lola",
      description: "Captura la esencia y personalidad en un momento íntimo",
    },
    {
      src: "/images/hands-fabric.jpg",
      alt: "Hands with fabric",
      title: "Texturas",
      description: "Exploración de materiales y formas a través de las manos",
    },
    {
      src: "/images/corset-back.png",
      alt: "White corset top",
      title: "Lola 24",
      description: "Diseño contemporáneo que reinterpreta la feminidad",
    },
    {
      src: "/images/woman-megaphone.jpg",
      alt: "Additional image 1",
      title: "Expresión",
      description: "Nuevas perspectivas del proyecto artístico",
    },
    {
      src: "/images/evocacion-woman.jpg",
      alt: "Additional image 2",
      title: "Intimidad",
      description: "Momentos capturados en su esencia más pura",
    },
  ];

  const getMaxSlide = () => {
    const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
    const cardsPerView = isMobile ? 1 : 4;
    return Math.max(0, sliderImages.length - cardsPerView);
  };

  const nextSlide = () => {
    const maxSlide = getMaxSlide();
    setCurrentSlide((prev) => (prev >= maxSlide ? 0 : prev + 1));
  };

  const prevSlide = () => {
    const maxSlide = getMaxSlide();
    setCurrentSlide((prev) => (prev <= 0 ? maxSlide : prev - 1));
  };

  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart({
      x: e.targetTouches[0].clientX,
      y: e.targetTouches[0].clientY,
    });
    setIsDragging(false);
    setDragOffset(0);
    setIsHorizontalSwipe(null);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    if (!touchStart) return;

    const currentTouch = {
      x: e.targetTouches[0].clientX,
      y: e.targetTouches[0].clientY,
    };

    if (isHorizontalSwipe === null) {
      const xDiff = Math.abs(touchStart.x - currentTouch.x);
      const yDiff = Math.abs(touchStart.y - currentTouch.y);

      // Solo interceptar si es claramente un gesto horizontal
      if (xDiff > yDiff && xDiff > 10) {
        setIsHorizontalSwipe(true);
        setIsDragging(true);
      } else if (yDiff > xDiff && yDiff > 10) {
        // Es un scroll vertical, no interceptar
        setIsHorizontalSwipe(false);
        return;
      } else {
        // Aún no está claro, esperar más movimiento
        return;
      }
    }

    // Solo prevenir scroll si es definitivamente un swipe horizontal
    if (!isHorizontalSwipe || !isDragging) return;

    // Solo prevenir el default si el movimiento horizontal es significativo
    const xDiff = Math.abs(touchStart.x - currentTouch.x);
    if (xDiff > 15) {
      e.preventDefault();
    }

    const diff = touchStart.x - currentTouch.x;
    const maxSlide = getMaxSlide();

    const containerWidth = sliderRef.current?.offsetWidth || 0;
    const dragPercentage = (diff / containerWidth) * 100;

    const currentOffset = currentSlide * 100;
    const newOffset = Math.max(
      -10,
      Math.min(maxSlide * 100 + 10, currentOffset + dragPercentage)
    );

    setDragOffset(newOffset - currentOffset);
    setTouchEnd(currentTouch);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd || !isDragging || !isHorizontalSwipe) {
      setTouchStart(null);
      setTouchEnd(null);
      setIsDragging(false);
      setDragOffset(0);
      setIsHorizontalSwipe(null);
      return;
    }

    const distance = touchStart.x - touchEnd.x;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    const maxSlide = getMaxSlide();

    const containerWidth = sliderRef.current?.offsetWidth || 0;
    const dragPercentage = (Math.abs(distance) / containerWidth) * 100;

    if (isLeftSwipe && currentSlide < maxSlide) {
      setCurrentSlide((prev) => prev + 1);
    } else if (isRightSwipe && currentSlide > 0) {
      setCurrentSlide((prev) => prev - 1);
    } else if (dragPercentage > 15) {
      if (distance > 0 && currentSlide < maxSlide) {
        setCurrentSlide((prev) => prev + 1);
      } else if (distance < 0 && currentSlide > 0) {
        setCurrentSlide((prev) => prev - 1);
      }
    }

    setTouchStart(null);
    setTouchEnd(null);
    setIsDragging(false);
    setDragOffset(0);
    setIsHorizontalSwipe(null);
  };

  const openModal = (index: number) => {
    setSelectedImage(index);
  };

  const closeModal = () => {
    setSelectedImage(null);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.message.trim()) return;

    setIsSubmitting(true);

    // Create mailto link with form data
    const subject = encodeURIComponent(
      `Mensaje de ${formData.name || "Visitante del portfolio"}`
    );
    const body = encodeURIComponent(`
Nombre: ${formData.name || "No especificado"}

Mensaje:
${formData.message}

---
Enviado desde el portfolio de Sofia Albornoz
    `);

    const mailtoLink = `mailto:sofivalbornoz@gmail.com?subject=${subject}&body=${body}`;

    // Open email client
    window.location.href = mailtoLink;

    // Reset form after a short delay
    setTimeout(() => {
      setFormData({ message: "", name: "" });
      setIsSubmitting(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="relative h-screen">
        <Image
          src="/images/header-hero.jpg"
          alt="People sitting with megaphone"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/30" />
        <div className="absolute inset-0 flex items-center justify-center px-4">
          <h1 className="text-white text-3xl sm:text-4xl md:text-6xl lg:text-8xl font-display font-light tracking-widest text-center">
            SOFIA ALBORNOZ
          </h1>
        </div>
      </div>

      <div className="py-10 md:py-20 px-4 md:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center md:items-start justify-center gap-8 md:gap-16 mt-5 md:mt-10">
            <div className="flex-shrink-0 order-2 md:order-1">
              <Image
                src="/images/hands-fabric.jpg"
                alt="Hands holding white fabric"
                width={280}
                height={380}
                className="object-cover w-64 h-80 md:w-70 md:h-96"
              />
            </div>

            <div className="flex flex-col items-center md:items-start md:ml-8 order-1 md:order-2">
              <div className="mb-4 md:mb-6 text-center md:text-left">
                <h2 className="text-3xl md:text-4xl font-heading font-normal text-gray-800 leading-tight">
                  Evocación
                </h2>
                <h3 className="text-3xl md:text-4xl font-heading font-normal text-gray-800">
                  Lola
                </h3>
              </div>

              <div className="mt-4 md:mt-8">
                <Image
                  src="/images/evocacion-woman.jpg"
                  alt="Smiling woman with curly hair"
                  width={320}
                  height={280}
                  className="object-cover w-72 h-64 md:w-80 md:h-70"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="py-10 md:py-20 px-4 md:px-8 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
            <div>
              <Image
                src="/images/woman-megaphone.jpg"
                alt="Woman with megaphone in front of pink building"
                width={400}
                height={500}
                className="w-full h-auto object-cover rounded-lg"
              />
            </div>
            <div className="space-y-4">
              <p className="text-gray-700 text-base md:text-lg leading-relaxed font-body">
                Es un registro fotográfico que forma parte de un proyecto
                artístico teatral que busca reivindicar a Lola mora etc.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="py-10 md:py-20 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="relative">
            <div className="hidden md:flex justify-between items-center mb-6">
              <button
                onClick={prevSlide}
                className="bg-white/80 hover:bg-white rounded-full p-3 shadow-lg transition-all duration-200 hover:scale-110">
                <ChevronLeft className="w-6 h-6 text-gray-800" />
              </button>

              <div className="flex space-x-2">
                {Array.from({
                  length:
                    typeof window !== "undefined"
                      ? Math.max(1, getMaxSlide() + 1)
                      : 3,
                }).map((_, index) => (
                  <button
                    key={index}
                    onClick={() =>
                      setCurrentSlide(Math.min(index, getMaxSlide()))
                    }
                    className={`w-2 h-2 rounded-full transition-all duration-200 ${
                      currentSlide === index ? "bg-gray-800 w-6" : "bg-gray-400"
                    }`}
                  />
                ))}
              </div>

              <button
                onClick={nextSlide}
                className="bg-white/80 hover:bg-white rounded-full p-3 shadow-lg transition-all duration-200 hover:scale-110">
                <ChevronRight className="w-6 h-6 text-gray-800" />
              </button>
            </div>

            <div className="md:hidden overflow-hidden px-4">
              <div
                ref={sliderRef}
                className={`flex ${
                  isDragging ? "" : "transition-transform duration-500 ease-out"
                }`}
                style={{
                  transform: `translateX(-${currentSlide * 100 + dragOffset}%)`,
                }}
                onTouchStart={onTouchStart}
                onTouchMove={onTouchMove}
                onTouchEnd={onTouchEnd}>
                {sliderImages.map((image, index) => (
                  <div
                    key={index}
                    className="flex-shrink-0 w-full px-2 relative cursor-pointer overflow-hidden rounded-lg h-[28rem] group"
                    onClick={() => !isDragging && openModal(index)}>
                    <div className="w-full h-full relative overflow-hidden rounded-lg">
                      <Image
                        src={image.src || "/placeholder.svg"}
                        alt={image.alt}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                      <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                        <h3 className="text-xl font-heading font-normal mb-3">
                          {image.title}
                        </h3>
                        <p className="text-base leading-relaxed opacity-90 font-body">
                          {image.description}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="hidden md:block overflow-visible px-8">
              <div
                className="flex transition-transform duration-500 ease-out gap-6"
                style={{
                  transform: `translateX(-${currentSlide * 25}%)`,
                }}>
                {sliderImages.map((image, index) => (
                  <div
                    key={index}
                    className={`flex-shrink-0 relative cursor-pointer transition-all duration-500 ease-out overflow-hidden rounded-xl group ${
                      hoveredCard === index
                        ? "w-[380px] h-[480px] shadow-2xl"
                        : hoveredCard !== null
                        ? "w-1/4 h-96 opacity-70"
                        : "w-1/4 h-96"
                    }`}
                    onMouseEnter={() => setHoveredCard(index)}
                    onMouseLeave={() => setHoveredCard(null)}
                    onClick={() => openModal(index)}>
                    <Image
                      src={image.src || "/placeholder.svg"}
                      alt={image.alt}
                      fill
                      className="object-cover transition-transform duration-500 ease-out"
                    />

                    <div
                      className={`absolute inset-0 transition-all duration-500 ${
                        hoveredCard === index
                          ? "bg-gradient-to-t from-black/80 via-black/30 to-transparent"
                          : "bg-gradient-to-t from-black/70 via-black/20 to-transparent"
                      }`}
                    />

                    <div
                      className={`absolute top-6 right-6 bg-white/20 rounded-full p-3 transition-all duration-300 ${
                        hoveredCard === index
                          ? "opacity-100 bg-white/30"
                          : "opacity-0 group-hover:opacity-100"
                      }`}>
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    </div>

                    <div
                      className={`absolute bottom-0 left-0 right-0 transition-all duration-500 text-white ${
                        hoveredCard === index ? "p-8" : "p-6"
                      }`}>
                      <h3
                        className={`font-heading font-normal transition-all duration-500 leading-tight ${
                          hoveredCard === index
                            ? "text-3xl mb-4"
                            : "text-lg mb-2"
                        }`}>
                        {image.title}
                      </h3>

                      <p
                        className={`leading-relaxed transition-all duration-500 font-body ${
                          hoveredCard === index
                            ? "opacity-100 text-lg"
                            : "opacity-90 text-sm"
                        }`}>
                        {image.description}
                      </p>

                      <div
                        className={`transition-all duration-500 bg-white/60 mt-4 ${
                          hoveredCard === index
                            ? "w-12 h-0.5 opacity-100"
                            : "w-0 h-0.5 opacity-0"
                        }`}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex md:hidden justify-center mt-6 space-x-2">
              {Array.from({
                length:
                  typeof window !== "undefined"
                    ? Math.max(1, getMaxSlide() + 1)
                    : 3,
              }).map((_, index) => (
                <button
                  key={index}
                  onClick={() =>
                    setCurrentSlide(Math.min(index, getMaxSlide()))
                  }
                  className={`w-2 h-2 rounded-full transition-all duration-200 ${
                    currentSlide === index ? "bg-gray-800 w-6" : "bg-gray-400"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="py-10 md:py-20 px-4 md:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
            <div className="order-2 md:order-1">
              <h2 className="text-3xl md:text-4xl font-heading font-normal text-gray-800 mb-6 md:mb-8 text-center md:text-left">
                Soy Sofi
              </h2>
              <p className="text-gray-700 text-base md:text-lg leading-relaxed text-center md:text-left font-body">
                Estudiante de segundo año de la Tecnicatura en Fotografía en la
                facultad Artes.
              </p>
            </div>
            <div className="order-1 md:order-2">
              <Image
                src="/images/Sofia.jpg"
                alt="Sofia"
                width={350}
                height={400}
                className="w-full h-auto object-cover rounded-lg max-w-sm mx-auto md:max-w-none"
              />
            </div>
          </div>
        </div>
      </div>

      <div
        className="py-12 md:py-20 px-4 md:px-8"
        style={{
          backgroundColor: "#abb27f",
        }}>
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-heading font-normal text-gray-800 mb-8 md:mb-12">
            Contactos
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-start">
            {/* Contact Info */}
            <div className="space-y-6 md:space-y-8">
              <a
                href="https://instagram.com/soffialbornozz"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-4 hover:opacity-80 transition-opacity duration-200 cursor-pointer">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                  <Instagram className="w-6 h-6 text-gray-700" />
                </div>
                <span className="text-xl md:text-2xl text-gray-700 font-ui font-normal">
                  soffialbornozz
                </span>
              </a>

              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                  <Phone className="w-6 h-6 text-gray-700" />
                </div>
                <span className="text-xl md:text-2xl text-gray-700 font-ui font-normal">
                  381502168
                </span>
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 md:p-8 shadow-lg">
              <p className="text-gray-700 text-lg mb-6 font-body font-normal">
                Si te interesa compartirme qué te pareció este trabajo...
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full p-4 border border-gray-200 rounded-xl text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300 transition-all duration-200 font-ui"
                    placeholder="Tu nombre (opcional)"
                  />
                </div>

                <div>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full p-4 border border-gray-200 rounded-xl resize-none text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300 transition-all duration-200 font-ui"
                    placeholder="Escribe tu mensaje aquí..."
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting || !formData.message.trim()}
                  className="w-full bg-gray-700 hover:bg-gray-800 disabled:bg-gray-400 text-white py-4 px-6 rounded-xl font-medium transition-all duration-200 flex items-center justify-center space-x-2 disabled:cursor-not-allowed font-ui">
                  <Send className="w-5 h-5" />
                  <span>{isSubmitting ? "Enviando..." : "Enviar mensaje"}</span>
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {selectedImage !== null && (
        <div className="fixed inset-0 bg-white z-50 flex items-center justify-center p-4">
          <div className="relative max-w-4xl max-h-[90vh] w-full">
            <button
              onClick={closeModal}
              className="absolute top-4 left-4 z-10 bg-gray-100 hover:bg-gray-200 rounded-lg px-4 py-2 text-gray-800 transition-colors duration-200 font-medium font-ui">
              Volver
            </button>

            <div className="relative w-full h-[60vh] md:h-[70vh] mb-6">
              <Image
                src={sliderImages[selectedImage].src || "/placeholder.svg"}
                alt={sliderImages[selectedImage].alt}
                fill
                className="object-contain"
              />
            </div>

            <div className="text-center text-gray-800 px-4">
              <h2 className="text-2xl md:text-3xl font-heading font-normal mb-4">
                {sliderImages[selectedImage].title}
              </h2>
              <p className="text-base md:text-lg leading-relaxed opacity-80 max-w-2xl mx-auto font-body">
                {sliderImages[selectedImage].description}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
