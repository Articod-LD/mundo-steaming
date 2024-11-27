import Avatar from "@/components/common/avatar";
import { CloseIcon } from "@/components/icons/close-icon";
import Image from "@/components/ui/image";
import Loader from "@/components/ui/loader/loader";
import { useModalAction } from "@/components/ui/modal/modal.context";
import { Title } from "@/components/ui/tittleSections";
import { siteSettings } from "@/data/static/site-settings";
import { useOneClientsQuery } from "@/data/user";
import AdminLayout from "@/layouts/admin";
import { searchModalInitialValues } from "@/utils/constants";
import { useAtom } from "jotai";
import { useParams } from "next/navigation";
import { format } from "date-fns";

const NoSubscriptionsMessage = () => {
  const { openModal } = useModalAction();
  const handleClick = () => openModal("AGREGAR_PLATAFORMA_USUARIO");

  return (
    <div className="flex flex-col items-center justify-center py-12 px-6 bg-gray-50 rounded-xl text-center">
      <h2 className="text-xl text-brand font-semibold">¡Ups!</h2>
      <p className="mt-4 text-lg text-gray-600">Este cliente no tiene suscripciones activas.</p>
      <p className="mt-2 text-sm text-gray-400">Puedes agregar una nueva suscripción haciendo clic en el botón de abajo.</p>
      <button
        className="mt-6 px-6 py-2 bg-brand text-white rounded-xl hover:bg-brand-dark focus:outline-none"
        onClick={handleClick}
      >
        + Agregar Plataforma
      </button>
    </div>
  );
}



export default function Dashboard({
  userPermissions,
}: {
  userPermissions: string[];
}) {
  const { id } = useParams();
  const idPredeterminado = Array.isArray(id) ? id[0] : id || "1";
  const [searchModal, setSearchModal] = useAtom(searchModalInitialValues);

  const { openModal } = useModalAction();
  const handleClick = () => openModal("AGREGAR_PLATAFORMA_USUARIO");

  const { client, error, loading } = useOneClientsQuery({
    ClientId: idPredeterminado,
  });


  console.log(client);


  if (loading) return <Loader text="Cargando" />;


  return (
    <>
      <Title title={`Informacion Cliente`} />
      <div className="flex flex-col sm:flex-row gap-6 w-full">
        {/* Datos del Usuario */}
        <div className="w-full sm:w-1/2 bg-white rounded-xl shadow-lg flex flex-col text-black">
          <div className="py-6 px-10 flex flex-col items-center justify-between border-b-2">
            <Avatar
              src={siteSettings?.avatar?.placeholder}
              rounded="full"
              name={client?.name}
              size="2xl"
              className="drop-shadow-lg bg-slate-800 text-white"
            />
            <span className="text-brand text-2xl font-semibold text-center">
              {client?.name}
            </span>
          </div>
          <div className="px-6 py-4 flex flex-col gap-4">
            <div>
              <span className="text-sm font-medium">Correo Electrónico</span>
              <p className="font-bold border-b-2 border-light-800">{client?.email}</p>
            </div>
            <div className="flex gap-4">
              <div className="w-1/2">
                <span className="text-sm font-medium">Teléfono</span>
                <p className="font-bold border-b-2 border-light-800">{client?.phone || 'No disponible'}</p>
              </div>
            </div>
            <div>
              <span className="text-sm font-medium">En Billetera</span>
              <div className="flex justify-between items-center">
                <span className="text-4xl text-red-500 font-bold">${client?.wallet}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Suscripciones del Usuario */}
        <div className="w-full h-auto flex flex-col justify-between sm:w-1/2 bg-white rounded-xl py-4 px-7 shadow-lg">
          <p className="font-semibold text-black mb-4">Plataformas Usuario</p>

          {client.suscriptions.length > 0 ? (
            <>
              <div>
                <div className="grid grid-cols-5 gap-4 mt-6 text-brand text-center font-bold">
                  <div className="col-span-2">Item</div>
                  <div className="col-span-1">Fecha Compra</div>
                  <div className="col-span-1">Fecha Inicio</div>
                  <div className="col-span-1">Fecha Fin</div>
                </div>
                {client.suscriptions.map(
                  ({ productos, end_date, start_date, price }, i) => {
                    const producto = productos && productos[0];
                    if (!producto) {
                      return null
                    }

                    let fecha_Fin_formateada = format(new Date(end_date), "dd/MM/yyyy");
                    let fecha_Inicio_formateada = format(new Date(start_date), "dd/MM/yyyy");
                    let fecha_compra = format(new Date(producto.purchase_date), "dd/MM/yyyy");

                    return (
                      <div key={i} className="grid grid-cols-5 gap-4 text-black my-6">
                        <div className="col-span-2 flex justify-center">
                          <Image
                            src={producto.plataforma.image_url}
                            width={150}
                            height={52}
                            quality={100}
                            alt={producto.plataforma.name}
                          />
                        </div>
                        <div className="col-span-1 flex justify-center items-center">{fecha_Inicio_formateada}</div>
                        <div className="col-span-1  flex justify-center items-center">{fecha_Inicio_formateada}</div>
                        <div className="col-span-1  flex justify-center items-center">{fecha_Fin_formateada}</div>
                      </div>
                    );
                  }
                )}
              </div>
              <div className="w-full flex justify-end mt-6">
                <button
                  className="p-3 bg-brand text-white rounded-xl transition-all hover:bg-red-800 hover:scale-105"
                  onClick={handleClick}
                >
                  + Agregar Plataforma
                </button>
              </div>
            </>
          ) : (
            <NoSubscriptionsMessage />
          )}
        </div>
      </div>
    </>
  );
}

Dashboard.authorization = true;

Dashboard.getLayout = function getLayout(page: any) {
  return <AdminLayout>{page}</AdminLayout>;
};
