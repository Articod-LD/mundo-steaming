import { CloseIcon } from "@/components/icons/close-icon";
import AnchorLink from "@/components/ui/links/anchor-link";
import routes from "@/config/routes";
import { useMe } from "@/data/user";
import { Recharge } from "@/types";

const RecargasAdmin = ({ recharges }: { recharges: Recharge[] }) => {

    const { me } = useMe();

    const isSuperAdmin = me?.permissions?.some(permission => permission.name === "super_admin");

    return (
        <div className="w-full flex justify-center">
            <div className="w-full max-w-7xl bg-white rounded-lg shadow-xl overflow-hidden">
                <div className="overflow-x-auto">
                    {recharges.length > 0 ? (
                        <>
                            {/* Encabezados de la Tabla */}
                            <div className="min-w-[800px] grid grid-cols-4 gap-4 px-6 py-4 bg-gray-100 text-brand font-semibold text-center">
                                <div className="col-span-1 text-lg">Nombre</div>
                                <div className="col-span-1 text-lg">Nomto</div>
                                <div className="col-span-1 text-lg">Estado</div>
                                <div className="col-span-1 text-lg">Fecha</div>
                            </div>
                            {/* Filas de Datos */}
                            {recharges.map((plataforma, i) => (
                                <div
                                    key={i}
                                    className="min-w-[800px] grid grid-cols-4 gap-4 px-6 items-center py-4 border-b border-gray-200 hover:bg-gray-50 transition duration-200"
                                >

                                    {/* Nombre */}
                                    <div className="col-span-1 text-center text-sm font-semibold text-gray-800">
                                        {
                                            isSuperAdmin ?
                                                <AnchorLink
                                                    href={`${routes.infoUsuario}/${plataforma.user.id}`}
                                                    className="text-lg text-black font-bold hover:text-brand transition duration-300"
                                                >
                                                    {plataforma.user.name}
                                                </AnchorLink>
                                                :
                                                <span className="text-lg text-black font-bold">{plataforma.user.name}</span>

                                        }

                                    </div>

                                    {/* Public Price */}
                                    <div className="col-span-1 text-center text-sm font-normal text-gray-800">
                                        ${parseFloat(plataforma.amount).toLocaleString()}
                                    </div>

                                    {/* Provider Price */}
                                    <div className="col-span-1 text-center text-sm font-bold text-gray-800 uppercase ">
                                        {plataforma.payment_status}
                                    </div>

                                    <div className="col-span-1 text-center text-sm font-bold text-gray-800 uppercase">
                                        {new Date(plataforma.created_at).toLocaleDateString('es-ES', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric',
                                        })}
                                    </div>

                                </div>
                            ))}
                        </>
                    ) : (
                        <div className="w-full h-[400px] flex justify-center items-center bg-gray-950">
                            <div className="text-center text-xl font-semibold text-gray-100">
                                <p>No tenemos Regargas registradas en este momento</p>
                                <p className="text-sm text-gray-500">registra plataformas para verlas en esta seccion.</p>
                            </div>
                        </div>
                    )}
                </div>

            </div>
        </div>
    )
}

export default RecargasAdmin;