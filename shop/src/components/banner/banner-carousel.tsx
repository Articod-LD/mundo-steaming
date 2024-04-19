import {
  Swiper,
  SwiperSlide,
  Navigation,
  Autoplay,
  Pagination,
} from "@/components/ui/slider";
import { useRef } from "react";
import { ChevronLeft } from "../icons/chevron.left";
import { ChevronRight } from "../icons/chevron.right";
import Image from "../ui/image";

export default function HeroCarousel() {
  const prevRef = useRef<HTMLDivElement>(null);
  const nextRef = useRef<HTMLDivElement>(null);

  return (
    <div className="relative">
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
        {[1, 2, 3].map((i) => (
          <SwiperSlide key={i}>
            <div className="w-full h-[740px] flex justify-center items-center md:justify-start">
              <Image
                className="-z-10 opacity-60"
                src="/hero2.png"
                layout="fill"
                objectFit="cover"
                quality={100}
                alt="img banner"
              />

              <div className="px-20 w-[600px]">
                <h1 className="font-bold text-5xl mb-3">
                  LOREM IPSUM DOLOR SIT AMET
                </h1>
                <p>
                  Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed
                  diam nonummy nibh euismod tincidunt ut laoreet dolore magna
                  aliquam erat volutpat. Ut wisi enim ad minim veniam, quis
                  nostrud exerci tation ul
                </p>
                <button className="p-2 bg-brand rounded mt-4 uppercase transition ease-in-out hover:scale-105 duration-300  hover:bg-red-900 ">
                  Suscribirme
                </button>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
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
