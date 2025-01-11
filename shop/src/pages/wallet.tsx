import AdminsList from "@/components/clients/clientes-lista";
import Loader from "@/components/ui/loader/loader";
import { useModalAction } from "@/components/ui/modal/modal.context";
import { Title } from "@/components/ui/tittleSections";
import { useClientsQuery, useMe, useRegisterWallet, useSoporte } from "@/data/user";
import AdminLayout from "@/layouts/admin";
import { SortOrder } from "@/types";
import { useState } from "react";

export default function Wallet() {
  const [amount, setAmount] = useState<string | number | readonly string[] | undefined>();
  const { mutate: rechargeAccount, isLoading, error } = useRegisterWallet();

  const { me } = useMe();

  const handlePayment = async () => {
    rechargeAccount({
      "user_id": me?.id,
      "amount": amount
    }, {
      onSettled(data, error, variables, context) {
        setAmount(undefined);
      },
      onSuccess(data: any, variables, context) {
        console.log(data);
        window.location.href = data.payment_url;
      },
      onError(error, variables, context) {
        error
      },
    })
  };

  return (
    <>
      <Title title="Recargar Billetera" />

      <div className="flex justify-center items-center">
        <form
          className="bg-white p-8 rounded-lg shadow-md w-full max-w-3xl space-y-6"
          onSubmit={(e) => {
            e.preventDefault();
            handlePayment();
          }}
        >
          <h2 className="text-2xl font-bold text-center text-brand uppercase">Recargar Billetera</h2>

          <div>
            <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
              Monto a recargar
            </label>
            <input
              type="number"
              id="amount"
              name="amount"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="mt-1 block w-full px-4 py-2 border rounded-md shadow-sm focus:ring-2 focus:ring-color-brand focus:outline-none text-black"
              placeholder="Ejemplo: 50000"
              min={50000}
              step={1000}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Método de pago
            </label>
            <div className="mt-2">
              <p className="text-sm text-gray-600">Será redirigido a <span className="text-brand">Mercado Pago</span> para completar el pago.</p>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-2 px-4 text-white font-bold rounded-md bg-brand hover:opacity-90 focus:ring-2 focus:ring-offset-2 focus:ring-color-brand focus:outline-none"
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader />
            ) : (
              'Recargar'
            )}
          </button>
        </form>
      </div>
    </>
  );
}

Wallet.authorization = true;

Wallet.getLayout = function getLayout(page: any) {
  return <AdminLayout>{page}</AdminLayout>;
};
