import { Swiper, Autoplay, SwiperSlide } from "@/components/ui/slider";

const Card: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  return (
    <Swiper
      id="popularesCarrusel"
      breakpoints={{
        200: {
          slidesPerView: 2.5,
        },
        1000: {
          slidesPerView: 3.5,
        },
        1600: {
          slidesPerView: 5,
        },
      }}
      spaceBetween={20}
      loop={true}
      autoplay
      allowTouchMove={true}
      modules={[Autoplay]}
    >
      {children}
    </Swiper>
  );
};

export default Card;
