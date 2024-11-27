import { useMe } from "@/data/user";
import Image from "../ui/image";
import { Title } from "../ui/tittleSections";
import Card from "./card";
import Items from "./items.module.css";

import { SwiperSlide } from "@/components/ui/slider";
import classNames from "classnames";
import { Product } from "@/types";
import { useModalAction } from "../ui/modal/modal.context";
export const UserSuscripcion: React.FC<{}> = () => {
  const { me } = useMe();
  const { openModal } = useModalAction();

  function verInfoCuenta(producto: Product) {
    openModal("VER_INFO_PLATAFORMA", producto);
  }
  
  const isSuperAdmin = me?.permissions?.some(permission => permission.name === "super_admin");

  if (isSuperAdmin) {
    return null;
  }

  return (
    <section>
      <Title title="mis suscripciones" />
      { me && me?.suscriptions.length > 0 ? (
        <Card>
          {me.suscriptions.map(({productos}, i) => {
            const producto = productos && productos[0];
            return (
              <SwiperSlide key={i}>
                <div
                  className={`w-full h-48 rounded-xl flex justify-center items-center relative ${producto.plataforma.type === 'completa' ? 'bg-brand' : 'bg-blue-500'
                    } border-2 ${producto.plataforma.type === 'completa' ? 'border-brand-dark' : 'border-blue-400'
                    } `}
                >
                  <Image
                    src={producto.plataforma.image_url}
                    objectFit="cover"
                    layout="fill"
                    quality={100}
                    alt="img banner"
                    className="object-cover rounded-lg opacity-80"
                  />
                  <div className="absolute inset-0 flex flex-col justify-center items-center bg-black bg-opacity-50 rounded-xl">
                    <span className="absolute top-1 right-3 uppercase">{producto.plataforma.type}</span>
                    <span className="font-bold text-white md:text-2xl mb-2 uppercase text-xl">
                      {producto.plataforma.name}
                    </span>
                    <button onClick={()=>verInfoCuenta(producto)} className="cursor-pointer p-3 mt-4 uppercase text-sm font-semibold text-white bg-[#1A1A1A] rounded hover:bg-[#333333] transition ease-in-out hover:scale-105 duration-300">
                     Ver Suscripcion
                    </button>
                  </div>
                </div>

              </SwiperSlide>
            );
          })}
        </Card>
      ) : (
        <div className="w-full h-[400px] flex justify-center items-center bg-gray-950">
          <div className="text-center text-xl font-semibold text-gray-200">
            <p>No tienes suscripciones disponibles en este momento</p>
            <p className="text-sm text-gray-500">Vuelve más tarde o explora otras secciones.</p>
          </div>
        </div>
      )}
    </section >
  );
};
