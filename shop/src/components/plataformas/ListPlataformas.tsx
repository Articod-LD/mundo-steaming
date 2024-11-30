import {
  useCreateSuscripcionMutation,
  useMe,
  usePlataformasDisponiblesQuery,
  usePlataformasQuery,
  useRegisterCategorieMutation,
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
import AnchorLink from "../ui/links/anchor-link";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
const MySwal = withReactContent(Swal);

const ListPlataformas: React.FC<{}> = () => {
  const { plataformas, error, loading } = usePlataformasDisponiblesQuery({
    limit: 20,
  });

  const { mutate: createBanner, isLoading } = useCreateSuscripcionMutation();

  const { me } = useMe();
  const isSuperAdmin = me?.permissions?.some(
    (permission) => permission.name === "super_admin"
  );
  const isProvider = me?.permissions?.some(
    (permission) => permission.name === "provider"
  );

  const handleSuscription = (plataforma: Plataforma) => {
    const prce =
      me && isProvider ? plataforma.provider_price : plataforma.public_price;

    if (parseFloat(me!.wallet) < parseFloat(prce)) {
      toast.error("No tienes saldo suficiente");
      return;
    }

    MySwal.fire({
      title: `Comprar Plataforma`,
      text: `Vas a a comprar una cuenta ${plataforma.name} tipo ${plataforma.type} de ${prce}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Suscribirme",
    }).then((result) => {
      if (result.isConfirmed) {
        createBanner(
          { variables: { plataforma_id: plataforma.id, user_id: me!.id } },
          {
            onSuccess(data, variables, context) {
              MySwal.fire({
                title: "Sucripcion creada!",
                icon: "success",
              });
            },
            onError(error: any) {
              toast.error(error.response.data.error);
            },
          }
        );
      }
    });
  };

  if (loading) {
    return (
      <div className="w-full h-[400px] flex justify-center items-center bg-gray-950">
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="animate-spin rounded-full border-4 border-t-4  border-brand-dark w-16 h-16 border-t-brand"></div>
          <p className="text-xl font-semibold text-gray-200">Cargando...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full h-[300px] flex justify-center items-center bg-red-100 rounded-xl">
        <div className="text-center space-y-4">
          <p className="text-xl text-red-600 font-semibold">¡Algo salió mal!</p>
          <p className="text-lg text-gray-600">
            No se pudieron cargar las plataformas. Por favor, inténtalo
            nuevamente más tarde.
          </p>
        </div>
      </div>
    );
  }

  return (
    <section>
      <Title title="Plataformas Disponibles" />
      {plataformas.length > 0 ? (
        <Card>
          {plataformas.map((plataforma, i) => (
            <SwiperSlide key={i}>
              <div
                className={`w-full h-48 rounded-xl flex justify-center items-center relative ${
                  plataforma.type === "completa" ? "bg-brand" : "bg-blue-500"
                } border-2 ${
                  plataforma.type === "completa"
                    ? "border-brand-dark"
                    : "border-blue-400"
                } `}
              >
                <Image
                  src={plataforma.image_url}
                  objectFit="cover"
                  layout="fill"
                  quality={100}
                  alt="img banner"
                  className="object-cover rounded-lg opacity-80"
                />
                <div className="absolute inset-0 flex flex-col justify-center items-center bg-black bg-opacity-50 rounded-xl">
                  <span className="absolute top-1 right-3 uppercase text-xs md:text-sm text-white truncate">
                    {plataforma.type}
                  </span>
                  <span className="font-bold text-white md:text-2xl text-center mb-2 uppercase text-lg flex flex-col truncate w-2/3 line-clamp-1">
                    NETFLIX PANTALLA COMPELTA DESDE EL INICIO DE LOS TIEMPSO
                    <span className="text-xs">
                      ({plataforma.count_avaliable} disponibles)
                    </span>
                  </span>
                  <p className="text-lg md:text-xl text-white truncate">
                    COP $
                    {me && isProvider
                      ? plataforma.provider_price
                      : plataforma.public_price}
                  </p>
                  {me ? (
                    !isSuperAdmin && (
                      <button
                        onClick={() => handleSuscription(plataforma)}
                        className="cursor-pointer p-3 mt-4 uppercase text-sm font-semibold text-white bg-[#1A1A1A] rounded hover:bg-[#333333] transition ease-in-out hover:scale-105 duration-300"
                      >
                        Suscribirme
                      </button>
                    )
                  ) : (
                    <AnchorLink
                      href={routes.login}
                      className="cursor-pointer p-3 mt-4 uppercase text-sm font-semibold text-white bg-[#1A1A1A] rounded hover:bg-[#333333] transition ease-in-out hover:scale-105 duration-300"
                    >
                      Suscribirme
                    </AnchorLink>
                  )}
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Card>
      ) : (
        <div className="w-full h-[400px] flex justify-center items-center bg-gray-950">
          <div className="text-center text-xl font-semibold text-gray-200">
            <p>No tenemos plataformas disponibles en este momento</p>
            <p className="text-sm text-gray-500">
              Vuelve más tarde o explora otras secciones.
            </p>
          </div>
        </div>
      )}
    </section>
  );
};

export default ListPlataformas;
