import ListPlataformas from "@/components/plataformas/ListPlataformas";
import Card from "@/components/plataformas/card";
import Items from "@/components/plataformas/items.module.css";
import Button from "@/components/ui/button";
import Image from "@/components/ui/image";
import { useModalAction } from "@/components/ui/modal/modal.context";
import { Title } from "@/components/ui/tittleSections";
import { useMe, usePlataformasDisponiblesQuery } from "@/data/user";
import AdminLayout from "@/layouts/admin";
import { Credencial, Product } from "@/types";
import { SwiperSlide } from "swiper/react";

export default function Dashboard({
  userPermissions,
}: {
  userPermissions: string[];
}) {

  const { me } = useMe();
  const { openModal } = useModalAction();

  function verInfoCuenta(producto: Product) {
    openModal("VER_INFO_PLATAFORMA", producto);
  }
  return (
    <>
      <Title title="Plataformas Suscritas" />

      <Card>
        {me!.suscriptions.length > 0 ? (
          me?.suscriptions.map(({ productos }, i) => {
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
            )
          })
        ) : (
          <div className="w-full h-[400px] flex justify-center items-center bg-gray-950">
            <div className="text-center text-xl font-semibold text-gray-200">
              <p>No tienes suscripciones disponibles en este momento</p>
              <p className="text-sm text-gray-500">Vuelve más tarde o explora otras secciones.</p>
            </div>
          </div>
        )}
      </Card>
      <div className="mt-10">
        <ListPlataformas />
      </div>
    </>
  );
}

Dashboard.authorization = true;

Dashboard.getLayout = function getLayout(page: any) {
  return <AdminLayout>{page}</AdminLayout>;
};
