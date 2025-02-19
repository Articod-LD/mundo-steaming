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
import Cart from "../icons/cart";
import { formatPrecioColombiano } from "@/utils/price";
const MySwal = withReactContent(Swal);

const ListPlataformas: React.FC<{}> = () => {
  const router = useRouter();

  const { plataformas, error, loading } = usePlataformasDisponiblesQuery({
    limit: 20,
  });

  const { me } = useMe();
  const isSuperAdmin = me?.permissions?.some(
    (permission) => permission.name === "super_admin"
  );
  const isProvider = me?.permissions?.some(
    (permission) => permission.name === "provider"
  );

  function AddCartOne(plataforma: Plataforma) {
    console.log("entro");

    const currentCart = localStorage.getItem("cart")
      ? JSON.parse(localStorage.getItem("cart")!)
      : [];

    const existingItemIndex = currentCart.findIndex(
      (item: Plataforma) => item.id === plataforma?.id
    );

    if (existingItemIndex !== -1) {
      let isUpdate = false;
      if (
        currentCart[existingItemIndex].cantidad < plataforma!.count_avaliable
      ) {
        currentCart[existingItemIndex].cantidad += 1;
        isUpdate = true;
        MySwal.fire({
          title: "Plataforma Añadida al carrito cantidad 1",
          icon: "success",
        });
      }

      if (!isUpdate) {
        MySwal.fire({
          title: "Maxima Cantidad de unidades disponibles",
          icon: "warning",
        });
        return;
      }
      localStorage.setItem("cart", JSON.stringify(currentCart));
      window.dispatchEvent(new Event("cartUpdated"));
    } else {
      const itemCart = {
        cantidad: 1,
        ...plataforma,
      };
      currentCart.push(itemCart);
      MySwal.fire({
        title: "Plataforma Agregada Al carrito cantidad 1",
        icon: "success",
      });
    }
    localStorage.setItem("cart", JSON.stringify(currentCart));
    window.dispatchEvent(new Event("cartUpdated"));
  }

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
                className="max-w-sm cursor-pointer"
                onClick={() => router.push(routes.detalle + plataforma.id)}
              >
                <div className="relative w-full h-20 md:h-28 lg:h-40">
                  <Image
                    src={plataforma.image_url}
                    objectFit="cover"
                    layout="fill"
                    quality={100}
                    alt="img banner"
                    className="object-cover rounded-2xl"
                  />
                </div>

                <div className="p-4 bg-opacity-50 flex">
                  <div className="w-full ">
                    <span className="font-light text-sm">
                      {plataforma.categoria.titulo}
                    </span>
                    <div className="mb-4">
                      <h3 className="font-bold text-white md:text-2xl uppercase text-lg truncate">
                        {plataforma.name}
                      </h3>
                      <span className="text-sm text-gray-300 block w-full">
                        Disponibilidad:{" "}
                        <span className="text-gray-400">
                          ({`${plataforma.count_avaliable} ${plataforma.type}`})
                        </span>
                      </span>
                    </div>
                    <p className="text-lg md:text-xl text-brand font-semibold">
                      {formatPrecioColombiano(
                        me && isProvider
                          ? plataforma.provider_price
                          : plataforma.public_price
                      )}
                    </p>
                  </div>

                  <div
                    className="flex items-center justify-end"
                    onClick={(e) => {
                      e.stopPropagation();
                      AddCartOne(plataforma);
                    }}
                  >
                    <div className="flex-shrink-0">
                      {me ? (
                        !isSuperAdmin && (
                          <button className="bg-brand p-2 rounded-md text-white hover:bg-brand-light hover:shadow-lg hover:scale-105 transition duration-300">
                            <Cart className="w-5 h-5 text-black" />
                          </button>
                        )
                      ) : (
                        <AnchorLink href={routes.login}>
                          <div className="bg-brand p-2 rounded-md text-white hover:bg-brand-light hover:shadow-lg hover:scale-105 transition duration-300">
                            <Cart className="w-5 h-5" />
                          </div>
                        </AnchorLink>
                      )}
                    </div>
                  </div>
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
