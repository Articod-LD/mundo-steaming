import AdminsList from "@/components/clients/clientes-lista";
import RecargasAdmin from "@/components/plataformas/admin/RecarasAdmin";
import Loader from "@/components/ui/loader/loader";
import { useModalAction } from "@/components/ui/modal/modal.context";
import { Title } from "@/components/ui/tittleSections";
import { useClientsQuery, useMe, usePlataformasQuery, useRecargasAdminQuery, useRecargasQuery } from "@/data/user";
import AdminLayout from "@/layouts/admin";
import { SortOrder } from "@/types";
import { useState } from "react";

export default function Recargas() {

    const {me} = useMe()

    const { rechages, error, loading } = useRecargasQuery({
        user_id: me?.id
    });

    const { openModal } = useModalAction();
    function handleClick() {
        openModal("CREAR_PLATAFORMA");
    }

    if (loading) return <Loader text="Cargando" />;

    return (
        <>
            <Title title="Mis Recargas"/>
            <RecargasAdmin recharges={rechages} />
        </>
    );
}

Recargas.authorization = true;

Recargas.getLayout = function getLayout(page: any) {
    return <AdminLayout>{page}</AdminLayout>;
};