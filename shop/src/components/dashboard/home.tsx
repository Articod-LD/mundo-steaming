import { NextPageWithLayout } from "@/types";
import HeroCarousel from "../banner/banner-carousel";
import ListPlataformas from "../plataformas/ListPlataformas";
import { UserSuscripcion } from "../plataformas/suscripciones";
import { ListCategorias } from "../categorias/listCategorias";
import { ListBeneficios } from "../Beneficios/ListBeneficios";

const Home: NextPageWithLayout = (userPermissions) => {
  return (
    <>
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
export default Home;
