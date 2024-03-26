import { useMe } from "@/data/user";
import Image from "../ui/image";
import { Title } from "../ui/tittleSections";
import Card from "./card";
import Items from "./items.module.css";

import { SwiperSlide } from "@/components/ui/slider";
import classNames from "classnames";
export const UserSuscripcion: React.FC<{}> = () => {
  const { me } = useMe();

  console.log(me?.suscription);

  return (
    <section
      className={classNames(
        typeof me !== "undefined" && me.suscription.length > 0
          ? "block"
          : "hidden"
      )}
    >
      <Title title="mis suscripciones" />

      <Card>
        {me?.suscription.map(({ credential }, i) => (
          <SwiperSlide key={i}>
            <div
              className={`bg-white h-36 rounded-xl flex justify-center items-center ${Items.hoverContainer}`}
            >
              <Image
                src={credential.tipo.image_url}
                width={150}
                height={52}
                quality={100}
                alt="img banner"
              />
              <div className={`${Items.overlay} hover:opacity-100`}>
                <button className="p-3 bg-[#1A1A1A] rounded mt-4 uppercase transition ease-in-out hover:scale-105 duration-300 ">
                  ADMINISTRAR SUSCRIPCIÓN
                </button>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Card>
    </section>
  );
};
