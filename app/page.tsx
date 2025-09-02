"use client";

import type React from "react";

import Image from "next/image";
import { Instagram, Phone, ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useRef } from "react";

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  const sliderRef = useRef<HTMLDivElement>(null);

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

  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      nextSlide();
    } else if (isRightSwipe) {
      prevSlide();
    }

    setTouchStart(null);
    setTouchEnd(null);
  };

  const openModal = (index: number) => {
    setSelectedImage(index);
  };

  const closeModal = () => {
    setSelectedImage(null);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header Section */}
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
          <h1 className="text-white text-3xl sm:text-4xl md:text-6xl lg:text-8xl font-light tracking-widest text-center">
            SOFIA ALBORNOZ
          </h1>
        </div>
      </div>

      {/* Evocación Lola Section */}
      <div className="py-10 md:py-20 px-4 md:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center md:items-start justify-center gap-8 md:gap-16 mt-5 md:mt-10">
            {/* Left image - positioned higher */}
            <div className="flex-shrink-0 order-2 md:order-1">
              <Image
                src="/images/hands-fabric.jpg"
                alt="Hands holding white fabric"
                width={280}
                height={380}
                className="object-cover w-64 h-80 md:w-70 md:h-96"
              />
            </div>

            {/* Right side - title and image */}
            <div className="flex flex-col items-center md:items-start md:ml-8 order-1 md:order-2">
              {/* Title positioned above the right image */}
              <div className="mb-4 md:mb-6 text-center md:text-left">
                <h2 className="text-3xl md:text-4xl font-light text-gray-800 leading-tight">
                  Evocación
                </h2>
                <h3 className="text-3xl md:text-4xl font-light text-gray-800">
                  Lola
                </h3>
              </div>

              {/* Right image - positioned lower than left image */}
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

      {/* Pink Building Section */}
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
              <p className="text-gray-700 text-base md:text-lg leading-relaxed">
                Es un registro fotográfico que forma parte de un proyecto
                artístico teatral que busca reivindicar a Lola mora etc.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Slider Section */}
      <div className="py-10 md:py-20 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="relative">
            {/* Navigation Arrows - hidden on mobile, visible on desktop */}
            <button
              onClick={prevSlide}
              className="hidden md:block absolute left-0 top-1/2 -translate-y-1/2 z-30 bg-white/80 hover:bg-white rounded-full p-2 shadow-lg transition-all duration-200 hover:scale-110">
              <ChevronLeft className="w-6 h-6 text-gray-800" />
            </button>

            <button
              onClick={nextSlide}
              className="hidden md:block absolute right-0 top-1/2 -translate-y-1/2 z-30 bg-white/80 hover:bg-white rounded-full p-2 shadow-lg transition-all duration-200 hover:scale-110">
              <ChevronRight className="w-6 h-6 text-gray-800" />
            </button>

            {/* Mobile: 2 cards visible with peek */}
            <div className="md:hidden overflow-hidden">
              <div
                ref={sliderRef}
                className="flex transition-transform duration-500 ease-out touch-pan-x"
                style={{
                  transform: `translateX(-${currentSlide * 90}%)`,
                }}
                onTouchStart={onTouchStart}
                onTouchMove={onTouchMove}
                onTouchEnd={onTouchEnd}>
                {sliderImages.map((image, index) => (
                  <div
                    key={index}
                    className="flex-shrink-0 w-[90%] mr-4 relative cursor-pointer overflow-hidden rounded-lg h-80 group"
                    onClick={() => openModal(index)}>
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
                    <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                      <h3 className="text-lg font-light mb-2">{image.title}</h3>
                      <p className="text-sm leading-relaxed opacity-90">
                        {image.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Desktop: 3-4 cards visible with navigation */}
            <div className="hidden md:block overflow-hidden">
              <div
                className="flex transition-transform duration-500 ease-out gap-4"
                style={{
                  transform: `translateX(-${currentSlide * 25}%)`,
                }}>
                {sliderImages.map((image, index) => (
                  <div
                    key={index}
                    className={`flex-shrink-0 w-1/4 relative cursor-pointer transition-all duration-500 ease-out overflow-hidden rounded-lg h-96 group ${
                      hoveredCard === index
                        ? "z-20 transform scale-105 shadow-2xl"
                        : "z-10"
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

                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                    {/* Click indicator for desktop */}
                    <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    </div>

                    {/* Content overlay */}
                    <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                      <h3
                        className={`font-light transition-all duration-500 ${
                          hoveredCard === index
                            ? "text-2xl mb-3"
                            : "text-lg mb-2"
                        }`}>
                        {image.title}
                      </h3>

                      <p
                        className={`text-sm leading-relaxed transition-all duration-500 ${
                          hoveredCard === index
                            ? "opacity-100 text-base transform translate-y-0"
                            : "opacity-90 text-xs transform translate-y-0"
                        }`}>
                        {image.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Dots indicator */}
            <div className="flex justify-center mt-6 space-x-2">
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

      {/* Soy Sofi Section */}
      <div className="py-10 md:py-20 px-4 md:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
            <div className="order-2 md:order-1">
              <h2 className="text-3xl md:text-4xl font-light text-gray-800 mb-6 md:mb-8 text-center md:text-left">
                Soy Sofi
              </h2>
              <p className="text-gray-700 text-base md:text-lg leading-relaxed text-center md:text-left">
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

      {/* Contactos Section */}
      <div
        className="py-10 md:py-20 px-4 md:px-8"
        style={{
          background: "linear-gradient(135deg, #a8d5a8 0%, #c8e6c8 100%)",
        }}>
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-light text-gray-800 mb-8 md:mb-12 text-center md:text-left">
            Contactos
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
            <div className="space-y-6 md:space-y-8">
              <div className="flex items-center justify-center md:justify-start space-x-4">
                <Instagram className="w-6 h-6 md:w-8 md:h-8 text-gray-700" />
                <span className="text-lg md:text-xl text-gray-700">
                  soffialbornozz
                </span>
              </div>

              <div className="flex items-center justify-center md:justify-start space-x-4">
                <Phone className="w-6 h-6 md:w-8 md:h-8 text-gray-700" />
                <span className="text-lg md:text-xl text-gray-700">
                  381502168
                </span>
              </div>
            </div>

            <div>
              <p className="text-gray-700 text-base md:text-lg mb-4 md:mb-6 text-center md:text-left">
                Si te interesa compartirme que te pareció este trabajo ...
              </p>

              <div className="space-y-4">
                <textarea
                  className="w-full h-24 md:h-32 p-3 md:p-4 border border-gray-300 rounded-lg resize-none text-sm md:text-base"
                  placeholder=""
                />
                <input
                  type="text"
                  className="w-full p-3 md:p-4 border border-gray-300 rounded-lg text-sm md:text-base"
                  placeholder=""
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Component */}
      {selectedImage !== null && (
        <div className="fixed inset-0 bg-white z-50 flex items-center justify-center p-4">
          <div className="relative max-w-4xl max-h-[90vh] w-full">
            <button
              onClick={closeModal}
              className="absolute top-4 left-4 z-10 bg-gray-100 hover:bg-gray-200 rounded-lg px-4 py-2 text-gray-800 transition-colors duration-200 font-medium">
              Volver
            </button>

            {/* Image */}
            <div className="relative w-full h-[60vh] md:h-[70vh] mb-6">
              <Image
                src={sliderImages[selectedImage].src || "/placeholder.svg"}
                alt={sliderImages[selectedImage].alt}
                fill
                className="object-contain"
              />
            </div>

            {/* Content */}
            <div className="text-center text-gray-800 px-4">
              <h2 className="text-2xl md:text-3xl font-light mb-4">
                {sliderImages[selectedImage].title}
              </h2>
              <p className="text-base md:text-lg leading-relaxed opacity-80 max-w-2xl mx-auto">
                {sliderImages[selectedImage].description}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
