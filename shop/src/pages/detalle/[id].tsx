import { ListBeneficios } from "@/components/Beneficios/ListBeneficios";
import HeroCarousel from "@/components/banner/banner-carousel";
import { ListCategorias } from "@/components/categorias/listCategorias";
import Cart from "@/components/icons/cart";
import ListPlataformas from "@/components/plataformas/ListPlataformas";
import Card from "@/components/plataformas/card";
import { UserSuscripcion } from "@/components/plataformas/suscripciones";
import BannerBack from "@/components/ui/banner/BannerBack";
import Button from "@/components/ui/button";
import AnchorLink from "@/components/ui/links/anchor-link";
import { Title } from "@/components/ui/tittleSections";
import routes from "@/config/routes";
import {
  useMe,
  usePlataformasCategoriasQuery,
  usePlataformasDisponiblesQuery,
  usePlataformasQuery,
} from "@/data/user";
import Layout from "@/layouts/_layout";
import { NextPageWithLayout, Plataforma } from "@/types";
import { getAuthCredentials } from "@/utils/auth";
import { SUPER_ADMIN } from "@/utils/constants";

import { GetServerSideProps } from "next";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { SwiperSlide } from "swiper/react";

import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { useRouter } from "next/router";
import { formatPrecioColombiano } from "@/utils/price";
const MySwal = withReactContent(Swal);

const Home: any = ({ userPermissions }: { userPermissions: string[] }) => {
  const { id } = useParams();
  const [name, setName] = useState("");
  const [count, setCount] = useState(1);
  const router = useRouter();

  const [plataforma, setPlataforma] = useState<Plataforma>();
  const [plataformaRelacionada, setPlataformaRelacionadas] = useState<
    Plataforma[] | undefined
  >([]);

  const { me } = useMe();
  const isSuperAdmin = me?.permissions?.some(
    (permission) => permission.name === "super_admin"
  );
  const isProvider = me?.permissions?.some(
    (permission) => permission.name === "provider"
  );

  const { plataformas, error, loading } = usePlataformasDisponiblesQuery({
    limit: 20,
  });

  useEffect(() => {
    const plataforma = plataformas.find(
      (plataformas) => plataformas.id == Number(id)
    );
    setPlataforma(plataforma);
    const plataformasSearch = plataformas.filter((p) => {
      return (
        p.categoria.titulo == plataforma?.categoria.titulo &&
        p.id !== Number(id)
      );
    });
    setPlataformaRelacionadas(plataformasSearch);
  }, [plataformas]);

  useEffect(() => {
    const cartString = localStorage.getItem("cart");
    const currentCart = cartString ? JSON.parse(cartString) : [];
    const existingItem = currentCart.find(
      (item: Plataforma) => item.id === plataforma?.id
    );
    if (existingItem) {
      setCount(existingItem.cantidad);
    }
  }, [plataforma]);

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

  function updateCount({ type }: { type: "suma" | "resta" }) {
    if (type === "resta" && count > 1) {
      setCount(count - 1);
      return;
    }
    if (type === "suma" && count < plataforma!.count_avaliable) {
      setCount(count + 1);
      return;
    }
    if (type === "suma" && count === plataforma!.count_avaliable) {
      MySwal.fire({
        title: "Maxima Cantidad de unidades disponibles",
        icon: "warning",
      });
      return;
    }
  }

  function AddCart() {
    const currentCart = localStorage.getItem("cart")
      ? JSON.parse(localStorage.getItem("cart")!)
      : [];

    const existingItemIndex = currentCart.findIndex(
      (item: Plataforma) => item.id === plataforma?.id
    );

    console.log(existingItemIndex);

    if (existingItemIndex !== -1) {
      if (
        currentCart[existingItemIndex].cantidad < plataforma!.count_avaliable
      ) {
        currentCart[existingItemIndex].cantidad += count;
      }
      MySwal.fire({
        title: "Plataforma Actualizada en el carrito",
        icon: "success",
      });
    } else {
      const itemCart = {
        cantidad: count,
        ...plataforma,
      };
      currentCart.push(itemCart);
      MySwal.fire({
        title: "Plataforma Agregada Al carrito",
        icon: "success",
      });
    }

    localStorage.setItem("cart", JSON.stringify(currentCart));

    window.dispatchEvent(new Event("cartUpdated"));
    router.push(routes.home);
  }

  return (
    <div className="w-full px-10 sm:px-0">
      {/* Banner de sección */}

      <div className="relative w-full h-[192px] py-14 bg-[#0e0d0d]">
        <Title title={`Detalle plataforma ${plataforma?.name}`} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-2 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-2 lg:border-r-2 sm:border-gray-800 p-2 md:p-10 gap-20 pb-10 sm:pb-0">
          <div
            className={`w-full !h-auto  md:h-64 rounded-xl flex justify-center items-center relative`}
          >
            <Image
              src={plataforma?.image_url ?? ""}
              layout="fill"
              quality={100}
              alt="img banner"
              className="rounded-lg opacity-80 !h-auto !relative"
            />
          </div>
          <div className="flex sm:flex-col flex-row justify-between sm:justify-normal">
            <div className="flex flex-col gap-3">
              <span>{plataforma?.categoria.titulo}</span>
              <h4 className="text-5xl">{plataforma?.name}</h4>
              <span className="text-brand text-2xl">
                {plataforma &&
                  formatPrecioColombiano(
                    me && isProvider
                      ? plataforma?.provider_price
                      : plataforma?.public_price
                  )}
              </span>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2 mt-5 w-2/3">
                <button
                  className="w-full h-10 flex items-center text-2xl justify-center bg-gray-800 text-white rounded hover:bg-gray-700 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  id="decrement"
                  aria-label="Disminuir cantidad"
                  onClick={() => updateCount({ type: "resta" })}
                >
                  -
                </button>

                <div className="w-full flex justify-center items-center">
                  {count}
                </div>

                <button
                  className="w-full h-10 flex items-center justify-center text-2xl bg-brand text-white rounded hover:bg-brand/50 transition duration-200"
                  id="increment"
                  aria-label="Incrementar cantidad"
                  onClick={() => updateCount({ type: "suma" })}
                >
                  +
                </button>
              </div>
              <Button className="mt-5 w-2/3 rounded-2xl" onClick={AddCart}>
                Agregar al carrito
              </Button>
            </div>
          </div>
        </div>
        <div className="p-2 sm:p-10 flex flex-col gap-3">
          <p>{plataforma?.description}</p>
        </div>
      </div>

      {/* Sección sobre nosotros con imagen */}
      <div className="py-5">
        <Title title="Plataformas Relacionadas" />
        {plataformaRelacionada!.length > 0 ? (
          <Card>
            {plataformaRelacionada!.map((plataforma, i) => (
              <SwiperSlide key={i}>
                <div className="max-w-sm">
                  <div className="relative w-full h-48">
                    <Image
                      src={plataforma!.image_url}
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
                            ({plataforma.count_avaliable}
                            {plataforma.type})
                          </span>
                        </span>
                      </div>
                      <p className="text-lg md:text-xl text-brand font-semibold">
                        $ 20000
                      </p>
                    </div>

                    <div className="flex items-center justify-end">
                      <div className="flex-shrink-0">
                        <button className="bg-brand p-2 rounded-md text-white hover:bg-brand-light hover:shadow-lg hover:scale-105 transition duration-300">
                          <Cart className="w-5 h-5 text-black" />
                        </button>
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
      </div>
    </div>
  );
};

Home.getLayout = function getLayout(page: any) {
  return <Layout subFooter={true}>{page}</Layout>;
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { permissions } = getAuthCredentials(ctx);

  return {
    props: {
      userPermissions: permissions,
    },
  };
};

export default Home;
