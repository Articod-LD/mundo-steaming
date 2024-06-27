import BannerAdmin from "@/components/plataformas/admin/BannerListAdmin";
import CategoriasAdmin from "@/components/plataformas/admin/CategoriesListAdmin";
import PlataformasAdmin from "@/components/plataformas/admin/PlataformaListAdmin";
import Loader from "@/components/ui/loader/loader";
import { Title } from "@/components/ui/tittleSections";
import {
  useBannerQuery,
  useCategoriesQuery,
  useClientsQuery,
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

  if (loadingBanner || loadingCategories) return <Loader text="Cargando" />;

  return (
    <>
      <div className="flex gap-6 flex-col lg:flex-row">
        <div className="w-full">
          <Title title="Banners" />
          <BannerAdmin Banners={banner} />
        </div>
        <div className="w-full">
          <Title title="Categorias" />
          <CategoriasAdmin categorias={categories} />
        </div>
      </div>
    </>
  );
}

Dashboard.authorization = true;

Dashboard.getLayout = function getLayout(page: any) {
  return <AdminLayout>{page}</AdminLayout>;
};
