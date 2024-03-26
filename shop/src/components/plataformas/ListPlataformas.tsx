import {
  useMe,
  usePlataformasDisponiblesQuery,
  usePlataformasQuery,
} from "@/data/user";
import Image from "../ui/image";
import { Title } from "../ui/tittleSections";
import Card from "./card";
import Items from "./items.module.css";

import { SwiperSlide } from "@/components/ui/slider";
import Loader from "../ui/loader/loader";
import { useModalAction } from "../ui/modal/modal.context";
import { Plataforma } from "@/types";
import routes from "@/config/routes";
import { useRouter } from "next/router";
const ListPlataformas: React.FC<{}> = () => {
  const { openModal } = useModalAction();

  const { plataformas, error, loading } = usePlataformasQuery({
    limit: 20,
  });

  console.log(plataformas);

  const { me } = useMe();
  const router = useRouter();

  function handleClick(plataforma: Plataforma) {
    if (!me) {
      router.push(routes.login);
      return;
    }
    openModal("CLIENTE_SOLICITAR_PLATAFORMA", plataforma);
  }

  return (
    <section>
      <Title title="Populares" />
      {loading ? (
        <h1 className="text-2xl text-white">Cargando...</h1>
      ) : plataformas.length > 0 ? (
        <Card>
          {plataformas.map((plataforma, i) => {
            const solicitudExistente = me?.solicitudes?.find(
              (solicitud) => solicitud.tipo_id === Number(plataforma.id)
            );

            const suscriptionExistente = me?.suscription?.find(
              (suscription) =>
                suscription?.credential?.tipo?.id === Number(plataforma.id)
            );

            console.log({ suscriptionExistente, solicitudExistente });

            return (
              <SwiperSlide key={i}>
                <div
                  className={`bg-white w-full h-36 rounded-xl flex justify-center items-center ${Items.hoverContainer}`}
                >
                  <Image
                    src={plataforma.image_url}
                    width={150}
                    height={52}
                    quality={100}
                    alt="img banner"
                  />
                  <div className={`${Items.overlay} hover:opacity-100`}>
                    {!solicitudExistente && !suscriptionExistente && (
                      <button
                        className="p-3 bg-[#1A1A1A] rounded mt-4 uppercase transition ease-in-out hover:scale-105 duration-300"
                        onClick={() => handleClick(plataforma)}
                      >
                        Suscribirse
                      </button>
                    )}
                    {solicitudExistente && !suscriptionExistente && (
                      <p className="p-3 bg-[#1A1A1A] rounded mt-4 uppercase transition ease-in-out hover:scale-105 duration-300">
                        Solicitud Pendiente
                      </p>
                    )}
                    {!solicitudExistente && suscriptionExistente && (
                      <p className="p-3 bg-[#1A1A1A] rounded mt-4 uppercase transition ease-in-out hover:scale-105 duration-300">
                        Ya estas Suscrito!
                      </p>
                    )}
                  </div>
                </div>
              </SwiperSlide>
            );
          })}
        </Card>
      ) : (
        <h1>No hay plataformas registradas</h1>
      )}
    </section>
  );
};

export default ListPlataformas;
