"use client";

import { useEffect, useState } from "react";

const slides = [
  {
    image: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1600&q=80",
    eyebrow: "Participação digital",
    title: "Eleições online com acesso simples e seguro",
    text: "Participe pelo celular, tablet ou computador, com uma experiência clara do acesso ao comprovante.",
  },
  {
    image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1600&q=80",
    eyebrow: "Assembleias online",
    title: "Deliberações e decisões em um único ambiente",
    text: "Questões, opções de resposta e participação digital organizadas para entidades e seus associados.",
  },
  {
    image: "https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=1600&q=80",
    eyebrow: "Gestão e transparência",
    title: "Acompanhe o processo da abertura à apuração",
    text: "Painel administrativo, controle de participantes e resultados reunidos em uma plataforma integrada.",
  },
];

export function HomeCarousel() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActive((current) => (current + 1) % slides.length);
    }, 6000);

    return () => window.clearInterval(timer);
  }, []);

  return (
    <div className="relative overflow-hidden rounded-[2rem] bg-[#07131f] text-white shadow-2xl shadow-[#07131f]/10">
      <div className="relative min-h-[360px] sm:min-h-[430px]">
        {slides.map((slide, index) => (
          <div
            key={slide.title}
            className={`absolute inset-0 transition-opacity duration-700 ${index === active ? "opacity-100" : "pointer-events-none opacity-0"}`}
            aria-hidden={index !== active}
          >
            <img
              src={slide.image}
              alt=""
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#07131f] via-[#07131f]/90 to-[#006b57]/25" />
            <div className="relative flex min-h-[360px] max-w-2xl flex-col justify-end p-7 sm:min-h-[430px] sm:p-10 lg:p-12">
              <p className="text-xs font-black uppercase tracking-[0.22em] text-[#62d6b7]">{slide.eyebrow}</p>
              <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">{slide.title}</h2>
              <p className="mt-4 max-w-xl text-base leading-7 text-slate-200 sm:text-lg">{slide.text}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="absolute bottom-6 right-6 z-10 flex gap-2">
        {slides.map((slide, index) => (
          <button
            key={slide.title}
            type="button"
            onClick={() => setActive(index)}
            className={`h-2.5 rounded-full transition-all ${index === active ? "w-8 bg-[#62d6b7]" : "w-2.5 bg-white/45 hover:bg-white/70"}`}
            aria-label={`Exibir destaque ${index + 1}`}
            aria-current={index === active ? "true" : undefined}
          />
        ))}
      </div>
    </div>
  );
}
