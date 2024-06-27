import { useState } from "react";
import { MovieIcon } from "../icons/movie";
import Image from "../ui/image";
import { Title } from "../ui/tittleSections";

export const ListBeneficios: React.FC<{}> = () => {
  const [Beneficios, setBeneficios] = useState([
    "Ofrecemos variedad de plataformas de streaming.",
    "Los usuarios pueden acceder al contenido en cualquier momento y en cualquier lugar, siempre que tengan un conexión a Internet.",
    "Nuestras pantallas son personalizadas.",
    "Nuestros precios son razonables.",
    "Ofrecemos contenido original lo que proporciona a los usuarios tengan acceso a programas y películas que no pueden encontrar en ningún otro lugar.",
    "Atención al cliente los 7 días de la semana.",
    "Garantía durante todo el tiempo contratado.",
  ]);
  return (
    <section>
      <Title title="NUESTROS BENEFICIOS" />

      <div className="w-full min-h-96 h-auto bg-cover bg-no-repeat mt-4 flex justify-start sm:justify-end items-center sm:px-28 rounded-lg relative pt-[445px] pb-14  sm:py-14 px-5 sm:text-left">
        <Image
          className="-z-10"
          src="/beneficios.png"
          layout="fill"
          objectFit="cover"
          quality={100}
          alt="img banner"
        />
        <div className="w-[400px]">
          <ul className="flex flex-col">
            {Beneficios.map((i) => (
              <li
                key={i}
                className="flex gap-4 justify-start items-center my-2 h-max"
              >
                <MovieIcon className="text-brand flex-shrink-0 h-12 w-12" />
                <div>
                  {/* <h5 className="font-bold text-base">
                    LOREM IPSUM DOLOR SIT AMET
                  </h5> */}
                  <p className="font-normal text-sm">{i}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
};
