import {
  Swiper,
  SwiperSlide,
  Navigation,
  Autoplay,
  Pagination,
} from "@/components/ui/slider";
import { useRef, useState } from "react";
import { ChevronLeft } from "../icons/chevron.left";
import { ChevronRight } from "../icons/chevron.right";
import Image from "../ui/image";
import { useBannerQuery, useCategoriesQuery, useMe } from "@/data/user";
import Router from "next/router";
import routes from "@/config/routes";

export default function HeroCarousel() {
  const prevRef = useRef<HTMLDivElement>(null);
  const nextRef = useRef<HTMLDivElement>(null);

  const { me } = useMe();

  // const { banner, error, loading } = useBannerQuery({
  //   limit: 20,
  // });

  // if (loading) {
  //   return <h1>Cargando...</h1>;
  // }

  const [Banner, setBanner] = useState([
    {
      id: 1,
      titulo: "MINISERIE ERIC",
      texto:
        "Un policía tenaz se adentra en el lado más oscuro de la Nueva York de los años ochenta para buscar a dos niños perdidos y descubre que la Gran Manzana está podrida por dentro.",
      imagen: "/imagenes/1.png",
      created_at: "2024-06-24T16:33:43.000000Z",
      updated_at: "2024-06-24T16:33:43.000000Z",
      imagen_url: "/imagenes/1.png",
    },
    {
      id: 2,
      titulo: "HACHIKO 2",
      texto:
        "Hachiko (Batong) es un lindo perro pastorchino. Conoce a su dueño Chen Jingxiu entre la gran multitud y se convierte en miembro de la familia Chen. Con el paso deltiempo, la casa que alguna vez fue hermosa ya no está allí, pero Batong espera y espera, sabiendo que su destino está estrechamente ligado a su familia.",
      imagen: "/imagenes/2.png",
      created_at: "2024-06-24T16:33:43.000000Z",
      updated_at: "2024-06-24T16:33:43.000000Z",
      imagen_url: "/imagenes/2.png",
    },
    {
      id: 3,
      titulo: "FNAF",
      texto:
        "Un problemático guardia de seguridad empieza a trabajar en la pizzería Freddy Fazbear's. Mientras pasa su primera noche en el trabajo, se da cuenta de que elturno de noche en Freddy's no será tan fácil de sobrellevar.",
      imagen: "/imagenes/3.png",
      created_at: "2024-06-24T16:33:43.000000Z",
      updated_at: "2024-06-24T16:33:43.000000Z",
      imagen_url: "/imagenes/3.png",
    },
  ]);

  return (
    <div className="relative">
      {Banner.length > 0 ? (
        <Swiper
          id="heroCarousel"
          slidesPerView={1}
          loop={true}
          autoplay
          allowTouchMove={false}
          pagination={{ clickable: true, bulletActiveClass: "!bg-brand" }}
          modules={[Navigation, Autoplay, Pagination]}
          navigation={{
            nextEl: ".next",
            prevEl: ".prev",
          }}
        >
          {Banner.map((item, i) => (
            <SwiperSlide key={i}>
              <div className="w-full h-[740px] flex justify-center items-center md:justify-start">
                <Image
                  className="-z-10 opacity-60"
                  src={item.imagen_url}
                  layout="fill"
                  objectFit="cover"
                  quality={100}
                  alt="img banner"
                />

                <div className="px-20 w-[600px]">
                  <h1 className="font-bold text-5xl mb-3">{item.titulo}</h1>
                  <p>{item.texto}</p>
                  {me ? (
                    <button
                      className="p-2 bg-brand rounded mt-4 uppercase transition ease-in-out hover:scale-105 duration-300  hover:bg-red-900"
                      onClick={() => Router.push(routes.dashboard)}
                    >
                      Suscribirme
                    </button>
                  ) : (
                    <button
                      className="p-2 bg-brand rounded mt-4 uppercase transition ease-in-out hover:scale-105 duration-300  hover:bg-red-900"
                      onClick={() => Router.push(routes.login)}
                    >
                      Suscribirme
                    </button>
                  )}
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      ) : (
        <h1>No hay Banners para mostrar</h1>
      )}

      <div className="absolute top-2/4 left-0 z-10 flex w-full items-center justify-between pl-1 pr-4 sm:pr-6 md:pl-2.5">
        <button className="prev flex h-8 w-8 -translate-y-1/2 transform cursor-pointer items-center justify-center rounded-full border border-light-400 bg-light text-dark-100 shadow-xl hover:bg-light-200 focus:outline-none rtl:rotate-180 dark:border-dark-400 dark:bg-dark-400 dark:text-white hover:dark:bg-dark-300 xl:h-9 xl:w-9">
          <ChevronLeft className="h-4 w-4 xl:h-[18px] xl:w-[18px]" />
        </button>
        <button className="next flex h-8 w-8 -translate-y-1/2 transform cursor-pointer items-center justify-center rounded-full border border-light-400 bg-light text-dark-100 shadow-xl hover:bg-light-200 focus:outline-none rtl:rotate-180 dark:border-dark-400 dark:bg-dark-400 dark:text-white hover:dark:bg-dark-300 xl:h-9 xl:w-9">
          <ChevronRight className="h-4 w-4 xl:h-[18px] xl:w-[18px]" />
        </button>
      </div>
    </div>
  );
}
