import AdminsList from "@/components/clients/clientes-lista";
import ProductosAdmin from "@/components/plataformas/admin/ProductosAdmin";
import Loader from "@/components/ui/loader/loader";
import { useModalAction } from "@/components/ui/modal/modal.context";
import { Title } from "@/components/ui/tittleSections";
import { useClientsQuery, usePlataformasQuery, useProductsQuery, useProvidersQuery } from "@/data/user";
import AdminLayout from "@/layouts/admin";
import { SortOrder } from "@/types";
import { useState } from "react";

export default function CargaProductos() {

  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [orderBy, setOrder] = useState("created_at");
  const [sortedBy, setColumn] = useState<SortOrder>(SortOrder.Desc);
  const { openModal } = useModalAction();

  const { products, error, loading, paginatorInfo } = useProductsQuery({
    limit: 20,
    page,
    name: searchTerm,
    orderBy,
    sortedBy,
  });

  usePlataformasQuery({
    limit: 20,
  });

  if (loading) return <Loader text="Cargando" />;

  return (
    <>
      <Title title="Productos" />
      <ProductosAdmin productos={products} />
    </>
  );
}

CargaProductos.authorization = true;
CargaProductos.getLayout = function getLayout(page: any) {
  return <AdminLayout>{page}</AdminLayout>;
};
