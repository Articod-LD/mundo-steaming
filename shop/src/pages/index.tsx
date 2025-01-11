import { ListBeneficios } from "@/components/Beneficios/ListBeneficios";
import HeroCarousel from "@/components/banner/banner-carousel";
import { ListCategorias } from "@/components/categorias/listCategorias";
import ListPlataformas from "@/components/plataformas/ListPlataformas";
import { UserSuscripcion } from "@/components/plataformas/suscripciones";
import routes from "@/config/routes";
import { useMe } from "@/data/user";
import Layout from "@/layouts/_layout";
import { NextPageWithLayout } from "@/types";
import { getAuthCredentials } from "@/utils/auth";
import { SUPER_ADMIN } from "@/utils/constants";

import { GetServerSideProps } from "next";

const Home: any = ({ userPermissions }: { userPermissions: string[] }) => {
  return (
    < >
      <HeroCarousel />
      <div className="flex flex-col gap-12 mt-14 mb-32">
        <ListPlataformas />
        <UserSuscripcion />
        <ListCategorias />
        <ListBeneficios />
      </div>
    </>
  );
};

Home.getLayout = function getLayout(page: any) {
  return <Layout subFooter={true}>{page}</Layout>
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
