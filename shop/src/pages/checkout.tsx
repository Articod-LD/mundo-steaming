import AdminsList from "@/components/clients/clientes-lista";
import Form from "@/components/ui/forms/form";
import Loader from "@/components/ui/loader/loader";
import { useModalAction } from "@/components/ui/modal/modal.context";
import { Title } from "@/components/ui/tittleSections";
import { useClientsQuery } from "@/data/user";
import Layout from "@/layouts/_layout";
import AdminLayout from "@/layouts/admin";
import { CheckoutInput, SortOrder } from "@/types";

import { useEffect, useState } from "react";
import * as yup from "yup";
import Input from "@/components/ui/input";
import Button from "@/components/ui/button";
import { useRouter } from "next/router";
import toast from "react-hot-toast";

const loginFormSchema = yup.object().shape({
  card_number: yup.string().required("el Numero de tarjeta es requerido"),
  expirationDate: yup.string().required("el Numero de tarjeta es requerido"),
  card_cvv: yup.string().required("el Numero de tarjeta es requerido"),
  plataforma_id: yup.string(),
  user_id: yup.string(),
});

export default function Dashboard(props: any) {
  const router = useRouter();

  const onSubmit = () => {
    console.log("hizo submit");

    setTimeout(() => {
      toast.error("transaccion rechazada, comunicate con tu administrador");
    }, 3000);
  };

  return (
    <div className="w-1/2 mx-auto bg-gray-100 shadow-md rounded-md overflow-hidden mt-16">
      <div className="bg-brand text-white p-4 flex justify-between">
        <div className="font-bold text-lg">Pago con tarjeta</div>
        <div className="text-lg">
          <i className="fab fa-cc-visa"></i>
        </div>
      </div>
      <div className="p-6">
        <Form<CheckoutInput>
          validationSchema={loginFormSchema}
          onSubmit={onSubmit}
        >
          {({ register, formState: { errors } }) => (
            <>
              <div className="mb-4">
                <label
                  className="block text-gray-700 font-bold mb-2"
                  htmlFor="card_number"
                >
                  Card Number
                </label>
                <Input
                  {...register("card_number")}
                  className="shadow appearance-none  rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="card_number"
                  type="text"
                  placeholder="xxxx xxxx xxxx xxxx"
                  error={errors?.card_cvv?.message!}
                />
              </div>
              <div className="mb-4 flex justify-between gap-2">
                <div className="w-full">
                  <label
                    className="block text-gray-700 font-bold mb-2"
                    htmlFor="expiration_date"
                  >
                    Expiration Date
                  </label>
                  <Input
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    id="expiration_date"
                    type="text"
                    placeholder="MM/YY"
                    {...register("expirationDate")}
                    error={errors?.card_number?.message}
                  />
                </div>
                <div className="w-full">
                  <label
                    className="block text-gray-700 font-bold mb-2"
                    htmlFor="cvv"
                  >
                    CVV
                  </label>
                  <Input
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    id="cvv"
                    type="text"
                    placeholder="XXX"
                    {...register("card_cvv")}
                    error={errors?.card_cvv?.message}
                  />
                </div>
              </div>

              <Button className="bg-brand text-white py-2 px-4 rounded font-bold hover:bg-red-700 focus:outline-none focus:shadow-outline">
                Realizar Pago
              </Button>
            </>
          )}
        </Form>
      </div>
    </div>
  );
}

Dashboard.authorization = true;

Dashboard.getLayout = function getLayout(page: any) {
  return <Layout>{page}</Layout>;
};
