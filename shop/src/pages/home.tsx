import AboutAdmin from "@/components/plataformas/admin/aboutAdmin";
import BannerAdmin from "@/components/plataformas/admin/BannerListAdmin";
import BeneficiosAdmin from "@/components/plataformas/admin/BeneficiosAdmin";
import CategoriasAdmin from "@/components/plataformas/admin/CategoriesListAdmin";
import ConfiguracionAdmin from "@/components/plataformas/admin/configuracionAdmin";
import PlataformasAdmin from "@/components/plataformas/admin/PlataformaListAdmin";
import Loader from "@/components/ui/loader/loader";
import { Title } from "@/components/ui/tittleSections";
import {
  useAboutQuery,
  useBannerQuery,
  useBeneficiosQuery,
  useCategoriesQuery,
  useClientsQuery,
  useConfiguracionQuery,
  usePlataformasQuery,
} from "@/data/user";
import AdminLayout from "@/layouts/admin";
import { SortOrder } from "@/types";
import { useState } from "react";

export default function Dashboard({
  userPermissions,
}: {
  userPermissions: string[];
}) {
  const {
    categories,
    error: errorCategories,
    loading: loadingCategories,
  } = useCategoriesQuery({
    limit: 20,
  });

  const {
    banner,
    error: errorBanner,
    loading: loadingBanner,
  } = useBannerQuery({
    limit: 20,
  });

  const { beneficios } = useBeneficiosQuery({
    limit: 20,
  });

  const { configuracion } = useConfiguracionQuery({
    limit: 20,
  });


  const { about } = useAboutQuery({
    limit: 20,
  });

  if (loadingBanner || loadingCategories) return <Loader text="Cargando" />;

  return (
    <>
      <div className="flex gap-6 flex-col">
        <div className="w-full flex gap-6 flex-col">
          <div className="w-full">
            <Title title="Configuracion" />
            <ConfiguracionAdmin configuracion={configuracion} />
          </div>
          <div className="w-full">
            <Title title="Categorias" />
            <CategoriasAdmin categorias={categories} />
          </div>
        </div>
        <div className="w-full flex gap-6 flex-col">
          <div className="w-full">
            <Title title="Beneficios" />
            <BeneficiosAdmin beneficios={beneficios} />
          </div>
          <div className="w-full">
            <Title title="Banners" />
            <BannerAdmin Banners={banner} />
          </div>
        </div>
        <div className="w-full flex gap-6 flex-col">
          <div className="w-full">
            <Title title="Sobre Nosotros" />
            <AboutAdmin about={about} />
          </div>
        </div>
      </div>
    </>
  );
}

Dashboard.authorization = true;

Dashboard.getLayout = function getLayout(page: any) {
  return <AdminLayout>{page}</AdminLayout>;
};
