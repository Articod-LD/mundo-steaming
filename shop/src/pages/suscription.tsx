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
  const [status, setStatus] = useState("");
  const [referencet, setReference] = useState<any>("");
  
  // Obtener el código de orden de la URL o del localStorage
  const getOrdenCode = () => {
    // Primero intentar obtener de la URL
    const ordenCodeFromUrl = router.query.ordenCode as string;
    if (ordenCodeFromUrl) {
      // Si está en la URL, guardarlo en localStorage
      localStorage.setItem('ordenCode', ordenCodeFromUrl);
      return ordenCodeFromUrl;
    }
    
    // Si no está en la URL, intentar obtenerlo del localStorage
    return localStorage.getItem('ordenCode') || "";
  };
  
  const ordenCode = getOrdenCode();
  
  const { suscription, loading } = useSuscriptionAdminQuery({
    orden_code: ordenCode,
  });

  useEffect(() => {
    // Si hay un código de orden, consultar el estado real en la base de datos
    if (ordenCode && suscription) {
      // La suscripción existe, lo que significa que el pago fue aprobado
      setStatus("approved");
      setOrdenCode(ordenCode);
      setPlataformas(suscription.plataformas || []);
      setuser(suscription.usuario);
      
      // Guardar en localStorage para futuras recargas
      localStorage.setItem('ordenCode', ordenCode);
      localStorage.setItem('status', 'approved');
    } else {
      // Si no hay suscripción pero hay parámetros en la URL, usar esos
      const { status, reference } = router.query;
      
      if (status === "pending") {
        setStatus("pending");
        setReference(reference);
        localStorage.setItem('status', 'pending');
        localStorage.setItem('reference', reference as string);
      } else if (status === "rejected") {
        setStatus("rejected");
        localStorage.setItem('status', 'rejected');
      } else if (status === "cancelled") {
        setStatus("cancelled");
        localStorage.setItem('status', 'cancelled');
      } else if (status === "unknown") {
        setStatus("unknown");
        localStorage.setItem('status', 'unknown');
      } else if (!status && !loading) {
        // Si no hay parámetros en la URL, intentar recuperar del localStorage
        const savedStatus = localStorage.getItem('status');
        if (savedStatus === 'approved' && ordenCode) {
          setStatus('approved');
        } else if (savedStatus === 'pending') {
          setStatus('pending');
          setReference(localStorage.getItem('reference'));
        } else if (savedStatus === 'rejected') {
          setStatus('rejected');
        } else if (savedStatus === 'cancelled') {
          setStatus('cancelled');
        } else if (savedStatus === 'unknown') {
          setStatus('unknown');
        }
      }
    }
  }, [router.query, suscription, loading, ordenCode]);

  return (
    <div className="flex flex-col gap-12 min-h-40 my-auto w-full items-center">
      {status == "approved" && (
        <div className="w-full max-w-6xl py-10">
          <span className="ml-5 text-lg font-medium">
            Orden: #{ordenCodeSuscription}
          </span>

          <div className="w-full flex flex-col lg:flex-row gap-6">
            {/* Sección de plataformas */}
            <div className="w-full lg:w-1/2 border-r border-gray-300 min-h-72 p-5">
              <h2 className="text-xl font-semibold mb-4">
                Tu pedido ({plataformas?.length || 0}) producto(s)
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {loading ? (
                  <p className="text-center text-gray-600">Cargando...</p>
                ) : plataformas?.length ? (
                  plataformas.map((plataforma, i) => (
                    <div
                      key={i}
                      className="border border-gray-400 rounded-lg p-4 shadow-md"
                    >
                      <div className="flex flex-col items-center">
                        <div className="relative w-32 h-20">
                          <Image
                            src={plataforma.image_url}
                            layout="fill"
                            objectFit="cover"
                            quality={100}
                            alt={plataforma.name}
                            className="rounded-2xl"
                          />
                        </div>
                        <div className="mt-4 text-center">
                          <span className="text-sm text-gray-100">
                            {plataforma.cantidad} {plataforma.type}
                          </span>
                          <h3 className="text-lg font-medium">
                            {plataforma.name}
                          </h3>
                        </div>
                        {plataforma.productos?.length > 0 && (
                          <div className="mt-3 w-full">
                            <h4 className="text-sm font-semibold text-gray-100">
                              Productos:
                            </h4>
                            <ul className="mt-1 text-xs text-gray-100">
                              {plataforma.productos.map((producto) => (
                                <li key={producto.id} className="border-b py-1">
                                  <p>
                                    <span className="font-semibold">
                                      Compra:
                                    </span>{" "}
                                    {producto.fecha_compra}
                                  </p>
                                  <p>
                                    <span className="font-semibold">
                                      Email:
                                    </span>{" "}
                                    {producto.email}
                                  </p>
                                  <p>
                                    <span className="font-semibold">Dias:</span>{" "}
                                    {producto.months}
                                  </p>
                                  <p>
                                    <span className="font-semibold">
                                      Contraseña:
                                    </span>{" "}
                                    {producto.password}
                                  </p>
                                  {producto.profile_name && (
                                    <p>
                                      <span className="font-semibold">
                                        Perfil:
                                      </span>{" "}
                                      {producto.profile_name}
                                    </p>
                                  )}
                                  {producto.profile_pin && (
                                    <p>
                                      <span className="font-semibold">
                                        PIN:
                                      </span>{" "}
                                      {producto.profile_pin}
                                    </p>
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
                  <p className="text-center text-gray-600">
                    No hay plataformas disponibles
                  </p>
                )}
              </div>
            </div>

            {/* Sección de detalles de la orden */}
            <div className="w-full flex flex-col gap-5 lg:w-1/2 p-5 items-center lg:items-start">
              <h2 className="text-xl font-semibold">Detalle de la orden</h2>
              <div className="flex flex-col gap-2 text-gray-100">
                <DetailItem icon={<EmailIcon />} text={user?.email} />
                <DetailItem
                  icon={<UsersIcon className="w-6 h-6" />}
                  text={user?.name}
                />
                <DetailItem
                  icon={<PhoneOutlineIcon />}
                  text={user?.phone || "N/A"}
                />
                <DetailItem
                  icon={<PhoneOutlineIcon />}
                  text={new Date().toDateString()}
                />
              </div>
              <button
                className="px-4 py-2 w-52 bg-brand text-black rounded-md disabled:opacity-50"
                onClick={() => router.push("/")}
              >
                Finalizar
              </button>
            </div>
          </div>
        </div>
      )}
      {status === "pending" && (
        <div className="w-full max-w-6xl py-10 text-center">
          <h2 className="text-2xl font-semibold">Orden en estado: Pendiente</h2>
          <div className="w-full flex flex-col items-center p-5">
            <h2 className="text-xl font-semibold">
              Detalle de la orden ${referencet}
            </h2>
            <div className="w-full flex flex-col items-center p-5 gap-2">
              <button
                className="mt-6 px-4 py-2 w-52 bg-yellow-500 text-black rounded disabled:opacity-50"
                onClick={() => window.location.reload()}
              >
                Recargar Pagina
              </button>
              <button
                className="mt-6 px-4 py-2 w-52 bg-yellow-500 text-black rounded disabled:opacity-50"
                onClick={() => router.push("/")}
              >
                Volver al inicio
              </button>
            </div>
          </div>
        </div>
      )}
      {status === "rejected" && (
        <div className="w-full max-w-6xl py-10 text-center">
          <h2 className="text-2xl font-semibold">Orden en estado: Rechazado</h2>
          <div className="w-full flex flex-col items-center p-5">
            <button
              className="mt-6 px-4 py-2 w-52 bg-yellow-500 text-black rounded disabled:opacity-50"
              onClick={() => router.push("/")}
            >
              Volver al inicio
            </button>
          </div>
        </div>
      )}
      {status === "cancelled" && (
        <div className="w-full max-w-6xl py-10 text-center">
          <h2 className="text-2xl font-semibold">Orden en estado: Cancelado</h2>
          <div className="w-full flex flex-col items-center p-5">
            <button
              className="mt-6 px-4 py-2 w-52 bg-yellow-500 text-black rounded disabled:opacity-50"
              onClick={() => router.push("/")}
            >
              Volver al inicio
            </button>
          </div>
        </div>
      )}

      {status === "unknown" && (
        <div className="w-full max-w-6xl py-10 text-center">
          <h2 className="text-2xl font-semibold">
            Orden en estado: Desconocido
          </h2>
          <div className="w-full flex flex-col items-center p-5 gap-2">
            <button
              className="mt-6 px-4 py-2 w-52 bg-yellow-500 text-black rounded disabled:opacity-50"
              onClick={() => window.location.reload()}
            >
              Recargar Pagina
            </button>
            <button
              className="mt-6 px-4 py-2 w-52 bg-yellow-500 text-black rounded disabled:opacity-50"
              onClick={() => router.push("/")}
            >
              Volver al inicio
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

const DetailItem = ({ icon, text }: any) => (
  <div className="flex gap-2 items-center">
    {icon}
    <span>{text}</span>
  </div>
);

Transacction.authorization = true;

Transacction.getLayout = function getLayout(page: any) {
  return <Layout subFooter={true}>{page}</Layout>;
};
