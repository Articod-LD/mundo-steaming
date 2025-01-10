import { ListBeneficios } from "@/components/Beneficios/ListBeneficios";
import HeroCarousel from "@/components/banner/banner-carousel";
import { ListCategorias } from "@/components/categorias/listCategorias";
import Cart from "@/components/icons/cart";
import ListPlataformas from "@/components/plataformas/ListPlataformas";
import { UserSuscripcion } from "@/components/plataformas/suscripciones";
import BannerBack from "@/components/ui/banner/BannerBack";
import AnchorLink from "@/components/ui/links/anchor-link";
import { Title } from "@/components/ui/tittleSections";
import routes from "@/config/routes";
import {
  useCategoriesQuery,
  useMe,
  usePlataformasCategoriasQuery,
} from "@/data/user";
import Layout from "@/layouts/_layout";
import { NextPageWithLayout } from "@/types";
import { getAuthCredentials } from "@/utils/auth";
import { SUPER_ADMIN } from "@/utils/constants";

import { GetServerSideProps } from "next";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useRouter } from "next/router";
import { useEffect } from "react";
import toast from "react-hot-toast";

const Home: any = ({ userPermissions }: { userPermissions: string[] }) => {
  const { name } = useParams();
  const router = useRouter();

  const { categories } = useCategoriesQuery({
    limit: 20,
  });

  useEffect(() => {
    const findCategorie = categories.find(
      (categorie) => categorie.titulo == name
    );

    if (!findCategorie) {
      router.push(routes.home);
      toast.success("categoria no existe");
    }
  }, [name]);

  const { plataformas, loading } = usePlataformasCategoriasQuery({
    name: name as string,
  });


  return (
    <div className="w-full">
      {/* Banner de sección */}

      <div className="relative w-full h-[192px] py-14 bg-[#0e0d0d]">
        <Title title={name} />
      </div>

      {loading && (
        <div className="w-full h-[400px] flex justify-center items-center bg-gray-950">
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="animate-spin rounded-full border-4 border-t-4 border-brand-dark w-16 h-16 border-t-brand"></div>
            <p className="text-xl font-semibold text-gray-200">Cargando...</p>
          </div>
        </div>
      )}

      {/* Sección sobre nosotros con imagen */}
      {plataformas.length > 0 ? (
        <div className="my-24 px-5 lg:px-20 w-full grid grid-cols-1 sm:grid-cols-4 gap-10 lg:flex-row">
          {plataformas.map((item, key) => (
            <div className="max-w-sm" key={key}>
              <div className="relative w-full h-48">
                <Image
                  src={item.image_url}
                  objectFit="cover"
                  layout="fill"
                  quality={100}
                  alt="img banner"
                  className="object-cover rounded-2xl bg-black"
                />
              </div>

              <div className="p-4 bg-opacity-50 flex">
                <div className="w-full ">
                  <span className="font-light text-sm">
                    {item.categoria.titulo}
                  </span>
                  <div className="mb-4">
                    <h3 className="font-bold text-white md:text-2xl uppercase text-lg truncate">
                      {item.name}
                    </h3>
                    <span className="text-sm text-gray-300 block w-full">
                      Disponibilidad:{" "}
                      <span className="text-gray-400">
                        ({item.count_avaliable} {item.type})
                      </span>
                    </span>
                  </div>
                  <p className="text-lg md:text-xl text-brand font-semibold">
                    $ {item.public_price}
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
          ))}
        </div>
      ) : (
        <div className="w-full h-[400px] flex justify-center items-center ">
          <div className="text-center text-xl font-semibold text-gray-200">
            <p>No tenemos plataformas disponibles en este momento</p>
            <p className="text-sm text-gray-500">
              Vuelve más tarde o explora otras secciones.
            </p>
          </div>
        </div>
      )}
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
