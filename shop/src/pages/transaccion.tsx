
import ActiveLink from "@/components/ui/links/active-link";
import AnchorLink from "@/components/ui/links/anchor-link";
import routes from "@/config/routes";
import { useMe } from "@/data/user";
import Layout from "@/layouts/_layout";
import classNames from "classnames";
import { useRouter } from "next/router";

const renderContent = (query: any, me:any) => {


    const isSuperAdmin = me?.permissions?.some((permission:any) => permission.name === "super_admin");

    const { status, amount, wallet, message, reference } = query;

    const statusStyles: any = {
        approved: 'bg-green-100 text-green-800 border-green-400',
        pending: 'bg-yellow-100 text-yellow-800 border-yellow-400',
        rejected: 'bg-red-100 text-red-800 border-red-400',
        cancelled: 'bg-gray-100 text-gray-800 border-gray-400',
        unknown: 'bg-indigo-100 text-indigo-800 border-indigo-400',
    };

    const icons: any = {
        approved: '🎉',
        pending: '⏳',
        rejected: '❌',
        cancelled: '🚫',
        unknown: '🤔',
    };

    const statusMessages: any = {
        approved: `Pago aprobado exitosamente.`,
        pending: `Tu pago está siendo procesado. Por favor, espera la confirmación.`,
        rejected: message || 'Hubo un problema con tu pago. Intenta nuevamente.',
        cancelled: message || 'El pago fue cancelado por el usuario.',
        unknown: message || 'No se pudo determinar el estado de tu transacción.',
    };

    const statusTitle: any = {
        approved: 'Pago Aprobado',
        pending: 'Pago Pendiente',
        rejected: 'Pago Rechazado',
        cancelled: 'Pago Cancelado',
        unknown: 'Estado Desconocido',
    };

    return (
        <div className={`min-w-96 mx-auto px-4 py-8 rounded-lg ${statusStyles[status]} flex flex-col items-center`}>
            <div className="flex items-center gap-4 mb-4">
                <span className="text-4xl">{icons[status]}</span>
                <h1 className="text-3xl font-semibold">{statusTitle[status]}</h1>
            </div>
            {status === 'approved' && (
                <div className="w-full">
                    <p className="text-lg">Monto recargado: <strong>COP {amount}</strong></p>
                    <p className="text-lg">Saldo actual: <strong>COP {wallet}</strong></p>
                    <div className="w-full flex items-center flex-col gap-4">
                        <p className="mt-4 text-lg">{statusMessages[status]}</p>
                        <AnchorLink
                            href={isSuperAdmin ? routes.recargasAdmin : routes.recargasUsers}
                            className={classNames(
                                "focus:ring-accent-700 h-9 shrink-0 justify-center rounded border border-transparent bg-brand px-3 py-0 text-sm font-semibold leading-none text-light outline-none transition duration-300 ease-in-out hover:bg-red-900 focus:shadow focus:outline-none focus:ring-1 uppercase hover:scale-105 flex items-center"
                            )}
                        >
                            Volver a Recargas
                        </AnchorLink>
                    </div>
                </div>
            )}
            {status === 'pending' && (
                <div>
                    <p className="text-lg">Referencia: <strong>{reference}</strong></p>
                    <p className="mt-4 text-lg">{statusMessages[status]}</p>

                    <AnchorLink href={routes.recargasUsers} className="focus:ring-accent-700 h-9 shrink-0 justify-center rounded border border-transparent bg-brand px-3 py-0 text-sm font-semibold leading-none text-light outline-none transition duration-300 ease-in-out hover:bg-red-900 focus:shadow focus:outline-none focus:ring-1 uppercase hover:scale-105 flex items-center">
                       Ver Tus Recargas
                    </AnchorLink>

                </div>
            )}
            {status === 'rejected' || status === 'cancelled' ? (
                <div className="mt-6">
                    <AnchorLink href={routes.recargarBilletera} className="focus:ring-accent-700 h-9 shrink-0 justify-center rounded border border-transparent bg-brand px-3 py-0 text-sm font-semibold leading-none text-light outline-none transition duration-300 ease-in-out hover:bg-red-900 focus:shadow focus:outline-none focus:ring-1 uppercase hover:scale-105 flex items-center">
                        Intentar nuevamente
                    </AnchorLink>
                </div>
            ) : null}
        </div>
    );
};

export default function Transacction() {
    const {me} = useMe()
    const router = useRouter();
    return (
        <>
            <div className="flex flex-col gap-12 min-h-40 my-auto">
                {renderContent(router.query,me)}
            </div>
        </>
    );
}

Transacction.authorization = true;

Transacction.getLayout = function getLayout(page: any) {
    return <Layout subFooter={true}>{page}</Layout>;
};
