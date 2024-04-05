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

export default function Dashboard({
  userPermissions,
}: {
  userPermissions: string[];
}) {
  const { id } = useParams();
  const idPredeterminado = Array.isArray(id) ? id[0] : id || "1";
  const [searchModal, setSearchModal] = useAtom(searchModalInitialValues);
  const { openModal } = useModalAction();

  const { client, error, loading } = useOneClientsQuery({
    ClientId: idPredeterminado,
  });

  function handleClick() {
    openModal("AGREGAR_PLATAFORMA_USUARIO", id);
  }

  if (loading) return <Loader text="Cargando" />;

  return (
    <>
      <Title title={`Cliente ${client?.name}`} />
      <div className="w-full  flex flex-col gap-6 sm:flex-row">
        <div className="w-full h-full sm:w-1/2 bg-white flex text-black rounded-xl">
          <div className="flex flex-col py-6 px-10 items-center justify-around border-r-2">
            <Avatar
              src={siteSettings?.avatar?.placeholder}
              rounded="full"
              name={client?.name}
              size="2xl"
              className="shrink-0 grow-0 basis-auto drop-shadow"
            />
            <span className="text-brand text-2xl text-center font-bold">
              {client?.name}
            </span>
            <div className="w-full  flex justify-center flex-col items-center">
              <p>suscripcion</p>
              <span className="font-bold">Premium</span>
            </div>
          </div>
          <div className="flex px-4 py-6 flex-col w-full gap-4">
            <div className="w-full">
              <span className="font-light">Correo Electronico</span>
              <p className="w-full border-b-2 border-light-800 font-bold">
                {client?.email}
              </p>
            </div>
            <div className="flex justify-between gap-3">
              <div className="w-1/2">
                <span>Telefono</span>
                <p className="w-full border-b-2 border-light-800 font-bold">
                  {client?.telefono}
                </p>
              </div>
              {/* <div className="w-1/2">
                <span>&nbsp;</span>
                <p className="w-full border-b-2 border-light-800 font-bold">
                  {client?.telefono}
                </p>
              </div> */}
            </div>
            <div className="w-full">
              <p className="font-bold">En billetera</p>
              <div className="flex justify-between">
                <span className="text-red-500 text-4xl font-bold">
                  ${client.billetera}
                </span>
                {/* {client.suscription && (
                  <div className="py-1 px-2 bg-[#84BB2E] rounded-2xl text-white flex items-center justify-center w-20">
                    Cancelado
                  </div>
                )} */}
              </div>
            </div>
          </div>
        </div>
        <div className="w-full h-auto flex flex-col justify-between sm:w-1/2 bg-white rounded-xl py-4 px-7">
          <p className="font-bold text-black">Plataformas Usuario</p>
          {client.suscription.length > 0 ? (
            <>
              <div className="grid grid-cols-12 grid-rows-0 gap-4 mt-6 text-brand text-center font-bold">
                <div></div>
                <div className="col-span-3">Item</div>
                <div className="col-span-2 col-start-5 row-start-1">
                  Fecha Compra
                </div>
                <div className="col-span-2 col-start-7 row-start-1">
                  Fecha Inicio
                </div>
                <div className="col-span-2 col-start-9 row-start-1">
                  Fecha Fin
                </div>
                <div className="col-span-2 col-start-11">Estado</div>
              </div>
              {client.suscription.map(
                ({ credential, Fecha_Fin, created_at, Fecha_Inicio }, i) => {
                  let fecha_Fin_formateada = format(
                    new Date(Fecha_Fin),
                    "dd/MM/yyyy"
                  );
                  let fecha_Compra_formateada = format(
                    new Date(created_at),
                    "dd/MM/yyyy"
                  );

                  let fecha_Inicio_formateada = format(
                    new Date(Fecha_Inicio),
                    "dd/MM/yyyy"
                  );
                  return (
                    <div
                      key={i}
                      className="grid grid-cols-12 gap-4 text-black my-6"
                    >
                      <div className="flex justify-center items-center text-brand">
                        <div className="border-2 rounded-full border-brand flex justify-center items-center">
                          <CloseIcon className="w-5 h-5" />
                        </div>
                      </div>
                      <div className="col-span-3 flex justify-center">
                        <Image
                          src={credential.tipo.image_url}
                          width={150}
                          height={52}
                          quality={100}
                          alt="image netflix"
                        />
                      </div>
                      <div className="col-span-2 col-start-5 row-start-1 flex justify-center items-center">
                        {fecha_Compra_formateada}
                      </div>
                      <div className="col-span-2 col-start-7 row-start-1 flex justify-center items-center">
                        {fecha_Inicio_formateada}
                      </div>
                      <div className="col-span-2 col-start-9 row-start-1 flex justify-center items-center">
                        {fecha_Fin_formateada}
                      </div>
                      <div className="col-span-2 col-start-11 flex justify-center items-center">
                        <div className="py-1 px-2 border-2 border-[#FFB422] rounded-2xl text-[#FFB422] flex items-center justify-center w-20">
                          Editar
                        </div>
                      </div>
                    </div>
                  );
                }
              )}
            </>
          ) : (
            <h1 className="text-brand text-2xl font-bold">No Suscripciones</h1>
          )}
          <div className="w-full  flex justify-end">
            <button
              className="p-2 bg-brand rounded-xl mt-4 transition ease-in-out hover:scale-105 hover:bg-red-800 duration-30 uppercase text-white flex"
              onClick={handleClick}
            >
              + Agregar Plataforma
            </button>
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
