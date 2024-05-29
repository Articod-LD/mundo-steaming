import ListPlataformas from "@/components/plataformas/ListPlataformas";
import Card from "@/components/plataformas/card";
import Items from "@/components/plataformas/items.module.css";
import Button from "@/components/ui/button";
import Image from "@/components/ui/image";
import { useModalAction } from "@/components/ui/modal/modal.context";
import { Title } from "@/components/ui/tittleSections";
import { useMe, usePlataformasDisponiblesQuery } from "@/data/user";
import AdminLayout from "@/layouts/admin";
import { SwiperSlide } from "swiper/react";

export default function Dashboard({
  userPermissions,
}: {
  userPermissions: string[];
}) {
  const { plataformas, error, loading, paginatorInfo } =
    usePlataformasDisponiblesQuery({
      limit: 20,
    });

  const { me } = useMe();
  const { openModal } = useModalAction();

  function verInfoCuenta(credenciales: any) {
    openModal("VER_INFO_PLATAFORMA", credenciales);
  }
  return (
    <>
      <Title title="Plataformas Suscritas" />
      {loading ? (
        <h1 className="text-2xl text-white">Cargando...</h1>
      ) : (
        <Card>
          {me!.suscription.length > 0 ? (
            me?.suscription.map(({ credential }, i) => (
              <SwiperSlide key={i}>
                <div
                  className={`bg-white w-full h-36 rounded-xl flex justify-center items-center ${Items.hoverContainer}`}
                >
                  <Image
                    src={credential.tipo.image_url}
                    width={150}
                    height={52}
                    quality={100}
                    alt="img banner"
                  />
                  <div className={`${Items.overlay} hover:opacity-100`}>
                    <button
                      onClick={() => verInfoCuenta(credential)}
                      className="p-3 bg-[#1A1A1A] rounded mt-4 uppercase transition ease-in-out hover:scale-105 duration-300 "
                    >
                      Ver Informacion
                    </button>
                  </div>
                </div>
              </SwiperSlide>
            ))
          ) : (
            <h1>No Tienes Suscripciones</h1>
          )}
        </Card>
      )}

      <ListPlataformas />
    </>
  );
}

Dashboard.authorization = true;

Dashboard.getLayout = function getLayout(page: any) {
  return <AdminLayout>{page}</AdminLayout>;
};
