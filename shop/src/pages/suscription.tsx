import { EmailIcon } from "@/components/icons/email";
import { UsersIcon } from "@/components/icons/icons/sidebar/users";
import { PhoneIcon, PhoneOutlineIcon } from "@/components/icons/phone";
import { UserIcon } from "@/components/icons/user-icon";
import ActiveLink from "@/components/ui/links/active-link";
import AnchorLink from "@/components/ui/links/anchor-link";
import { Title } from "@/components/ui/tittleSections";
import routes from "@/config/routes";
import {
  useMe,
  useSuscriptionAdminQuery,
} from "@/data/user";
import Layout from "@/layouts/_layout";
import { Product, SuscriptionPlataforma, SuscriptionUser } from "@/types";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function Transacction() {
  const { me } = useMe();
  const router = useRouter();
  const [plataformas, setPlataformas] = useState<SuscriptionPlataforma[]>([]);
  const [user, setuser] = useState<SuscriptionUser>();
  const [ordenCodeSuscription, setOrdenCode] = useState("");
  const { suscription, loading } = useSuscriptionAdminQuery({
    orden_code: router.query.ordenCode as string,
  });

  useEffect(() => {
    const { ordenCode } = router.query;
    if (ordenCode) {
      setOrdenCode(ordenCode as string);
      console.log(suscription);
      
      setPlataformas(suscription.plataformas);
      setuser(suscription.usuario)
    }
  }, [router.query, suscription]);

  return (
    <>
      <div className="flex flex-col gap-12 min-h-40 my-auto w-full items-center">
        <div className="w-full max-w-6xl py-10">
          <span className="ml-5">Orden: #{ordenCodeSuscription}</span>
          <div className="w-full flex flex-col lg:flex-row ">
            <div className="w-full lg:w-1/2 border-r border-gray-500 min-h-72 p-5">
              <Title title={`Tu pedido (${plataformas ? plataformas.length:0}) producto(s)`} />
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 ">
                {loading ? (
                  <h1>Cargando...</h1>
                ) : plataformas && plataformas.length ? (
                  plataformas.map((plataforma, i) => (
                    <div key={i} className="border rounded-lg min-h-40">
                      <div className="w-full flex flex-col h-48 items-center justify-center">
                        <div className="relative w-32 h-20">
                          <Image
                            src={plataforma.image_url}
                            layout="fill"
                            quality={100}
                            alt="img banner"
                            className="rounded-2xl"
                          />
                        </div>

                        <div className="mt-5 flex flex-col items-center">
                        <span className="text-xs">
                            {plataforma.cantidad} {plataforma.type}
                          </span>
                          <span className="text-xl">
                            {plataforma.name}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <h1>NO PLATAFORMAS</h1>
                )}
              </div>
            </div>
            <div className="w-full flex flex-col gap-5 lg:w-1/2 py-5 px-20">
              <Title title="Detalle de la orden" />
              <div className="flex flex-col">
                <div className="flex gap-2 items-center">
                  <EmailIcon />
                  <span>{user?.email}</span>
                </div>
                <div className="flex gap-2 items-center">
                  <UsersIcon className="w-6 h-6" />
                  <span>{user?.name}</span>
                </div>
                <div className="flex gap-2 items-center">
                  <PhoneOutlineIcon />
                  <span>{user?.phone ? user?.phone : 'N/A'}</span>
                </div>
              </div>
              <button
                className="px-4 py-2 w-52 bg-brand text-black rounded disabled:opacity-50"
                onClick={() => router.push(routes.home)}
              >
                Finalizar
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

Transacction.authorization = true;

Transacction.getLayout = function getLayout(page: any) {
  return <Layout subFooter={true}>{page}</Layout>;
};
