import { EmailIcon } from "@/components/icons/email";
import { UsersIcon } from "@/components/icons/icons/sidebar/users";
import { PhoneIcon, PhoneOutlineIcon } from "@/components/icons/phone";
import { UserIcon } from "@/components/icons/user-icon";
import ActiveLink from "@/components/ui/links/active-link";
import AnchorLink from "@/components/ui/links/anchor-link";
import { Title } from "@/components/ui/tittleSections";
import routes from "@/config/routes";
import { useMe, useSuscriptionAdminQuery } from "@/data/user";
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
      setPlataformas(suscription.plataformas);
      setuser(suscription.usuario);
    }
  }, [router.query, suscription]);

  return (
    <div className="flex flex-col gap-12 min-h-40 my-auto w-full items-center">
      <div className="w-full max-w-6xl py-10">
        <span className="ml-5">Orden: #{ordenCodeSuscription}</span>
        <div className="w-full flex flex-col lg:flex-row">
          {/* Sección de plataformas */}
          <div className="w-full lg:w-1/2 border-r border-gray-500 min-h-72 p-5 order-2 lg:order-1">
            <h2 className="text-xl font-semibold mb-4">
              Tu pedido ({plataformas?.length || 0}) producto(s)
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {loading ? (
                <h1>Cargando...</h1>
              ) : plataformas?.length ? (
                plataformas.map((plataforma, i) => (
                  <div key={i} className="border border-gray-400 rounded-lg p-4 shadow-md">
                    <div className="flex flex-col items-center">
                      {/* Imagen de la plataforma */}
                      <div className="relative w-32 h-20">
                        <Image
                          src={plataforma.image_url}
                          layout="fill"
                          objectFit="cover"
                          quality={100}
                          alt={plataforma.name}
                          className="rounded-2xl object-cover"
                        />
                      </div>

                      {/* Información de la plataforma */}
                      <div className="mt-4 text-center">
                        <span className="text-sm text-gray-600">
                          {plataforma.cantidad} {plataforma.type}
                        </span>
                        <h3 className="text-lg font-medium">
                          {plataforma.name}
                        </h3>
                      </div>

                      {/* Lista de productos */}
                      {plataforma.productos?.length > 0 && (
                        <div className="mt-3 w-full">
                          <h4 className="text-sm font-semibold text-gray-700">
                            Productos:
                          </h4>
                          <ul className="mt-1 text-xs text-gray-300">
                            {plataforma.productos.map((producto) => (
                              <li key={producto.id} className="border-b py-1">
                                <span className="font-semibold">Compra:</span>{" "}
                                {producto.fecha_compra}
                                <br />
                                <span className="font-semibold">
                                  Email:
                                </span>{" "}
                                {producto.email}
                                <br />
                                <span className="font-semibold">
                                  Meses:
                                </span>{" "}
                                {producto.months}
                                <br />
                                <span className="font-semibold">
                                  Contraseña:
                                </span>{" "}
                                {producto.password}
                                {producto.profile_name && (
                                  <>
                                    <br />
                                    <span className="font-semibold">
                                      Perfil:
                                    </span>{" "}
                                    {producto.profile_name}
                                  </>
                                )}
                                {producto.profile_pin && (
                                  <>
                                    <br />
                                    <span className="font-semibold">
                                      PIN:
                                    </span>{" "}
                                    {producto.profile_pin}
                                  </>
                                )}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <h1>No hay plataformas</h1>
              )}
            </div>
          </div>

          {/* Sección de detalles de la orden */}
          <div className="w-full flex flex-col gap-5 lg:w-1/2 p-5 order-1 lg:order-2 items-center lg:items-start">
            <h2 className="text-xl font-semibold">Detalle de la orden</h2>
            <div className="flex flex-col gap-2">
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
                <span>{user?.phone || "N/A"}</span>
              </div>
              <div className="flex gap-2 items-center">
                <PhoneOutlineIcon />
                <span>{new Date().toDateString()}</span>
              </div>
            </div>
            <button
              className="px-4 py-2 w-52 bg-brand text-black rounded disabled:opacity-50"
              onClick={() => router.push("/")}
            >
              Finalizar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

Transacction.authorization = true;

Transacction.getLayout = function getLayout(page: any) {
  return <Layout subFooter={true}>{page}</Layout>;
};
