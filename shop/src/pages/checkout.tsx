import Layout from "@/layouts/_layout";
import { getAuthCredentials } from "@/utils/auth";
import { GetServerSideProps } from "next";
import dynamic from "next/dynamic";
import { Step } from "../components/ui/stepper";
import { useEffect, useState } from "react";
import { Title } from "@/components/ui/tittleSections";
import Input from "@/components/ui/input";
import {
  useCreateSuscripcionMutation,
  useMe,
  useRegisterSuscriptionClient,
  useRegisterWallet,
} from "@/data/user";
import { Plataforma } from "@/types";
import Image from "next/image";
import Button from "@/components/ui/button";
import { formatPrecioColombiano } from "@/utils/price";
import { useRouter } from "next/router";
import routes from "@/config/routes";
import { WalletPointsIcon } from "@/components/icons/icons/wallet-point";
import CartCheckBag from "@/components/icons/cart-check-bag";

import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import toast from "react-hot-toast";
const MySwal = withReactContent(Swal);

const StepperComponent = dynamic(() => import("../components/ui/stepper"), {
  ssr: false,
});

const Checkout: any = () => {
  const [isValid, setIsValid] = useState<boolean>(true);
  const [cart, setCart] = useState<Plataforma[]>([]);
  const router = useRouter();
  const { mutate: createSuscriptionProvider, isLoading } =
    useCreateSuscripcionMutation();

  const { mutate: suscriptionClient, error } = useRegisterSuscriptionClient();

  const { me } = useMe();

  const isProvider = me?.permissions?.some(
    (permission) => permission.name === "provider"
  );

  useEffect(() => {
    const updateCart = () => {
      const cartString = localStorage.getItem("cart");
      const currentCart = cartString ? JSON.parse(cartString) : [];
      setCart(currentCart);
    };
    window.addEventListener("cartUpdated", updateCart);
    updateCart();
    return () => {
      window.removeEventListener("cartUpdated", updateCart);
    };
  }, []);

  function updateCount({
    type,
    plataforma,
  }: {
    type: "suma" | "resta";
    plataforma: Plataforma;
  }) {
    const currentCart = localStorage.getItem("cart")
      ? JSON.parse(localStorage.getItem("cart")!)
      : [];

    const existingItemIndex = currentCart.findIndex(
      (item: Plataforma) => item.id === plataforma?.id
    );

    if (existingItemIndex !== -1) {
      const existingItem = currentCart[existingItemIndex];

      // Verificar el tipo de operación
      if (type === "suma") {
        if (existingItem.cantidad < plataforma!.count_avaliable) {
          existingItem.cantidad += 1;
        } else {
          MySwal.fire({
            title: "Máxima cantidad de unidades disponibles alcanzada",
            icon: "warning",
          });
          return;
        }
      } else if (type === "resta") {
        if (existingItem.cantidad > 1) {
          existingItem.cantidad -= 1;
        } else {
          // Si la cantidad es 1 y se intenta restar, preguntar si se elimina
          MySwal.fire({
            title: "¿Deseas eliminarlo del carrito?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Eliminar",
          }).then((result) => {
            if (result.isConfirmed) {
              currentCart.splice(existingItemIndex, 1);
              localStorage.setItem("cart", JSON.stringify(currentCart));
              window.dispatchEvent(new Event("cartUpdated"));
            }
          });
          return;
        }
      }
    } else {
      MySwal.fire({
        title: "El producto no está en el carrito",
        icon: "error",
      });
      return;
    }

    // Actualizar el carrito en localStorage y notificar cambios
    localStorage.setItem("cart", JSON.stringify(currentCart));
    window.dispatchEvent(new Event("cartUpdated"));
  }

  function TotalCard(): string {
    const total = cart.reduce((acc, item) => {
      let precioPlataforma = item.public_price;
      if (isProvider) {
        precioPlataforma = item.provider_price;
      }
      return acc + Number(precioPlataforma) * Number(item.cantidad);
    }, 0);
    return total.toString();
  }

  const handleSuscription = () => {
    if (parseFloat(me!.wallet) < parseFloat(TotalCard())) {
      toast.error("No tienes saldo suficiente");
      return;
    }

    MySwal.fire({
      title: `Comprar Plataforma`,
      text: `Vas a a comprar la cantidad de ${cart.length} plataforma(s) esto sera descontado de tu billetera`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Suscribirme",
    }).then((result) => {
      if (result.isConfirmed) {
        const converted = cart.map((plataform) => {
          return {
            cantidad: plataform.cantidad ?? 0,
            id: plataform.id,
          };
        });

        createSuscriptionProvider(
          { variables: { user_id: me!.id, plataformas: converted } },
          {
            onSuccess(data, variables, context) {
              console.log(data);

              MySwal.fire({
                title: "Sucripcion creada!",
                icon: "success",
              });
              localStorage.removeItem("cart");

              router.push({
                pathname: routes.suscription,
                query: {
                  ordenCode: data.order_code,
                },
              });
            },
            onError(error: any) {
              toast.error(error.response.data.error);
            },
          }
        );
      }
    });
  };

  const handlePaymentClient = async () => {
    const converted = cart.map((plataform) => {
      return {
        cantidad: plataform.cantidad ?? 0,
        id: plataform.id,
      };
    });

    suscriptionClient(
      {
        user_id: me!.id,
        plataformas: converted,
      },
      {
        onSuccess(data: any, variables, context) {
          window.location.href = data.payment_url;
          localStorage.removeItem("cart");
        },
        onError(error, variables, context) {
          error;
        },
      }
    );
  };

  return (
    <div className="w-full px-10 sm:px-0 my-10">
      <StepperComponent activeColor="bg-brand" completedColor="bg-brand-dark">
        <Step
          isValid={cart.length > 0 && typeof me !== "undefined"}
          title="Carrito"
        >
          <div className="w-full flex flex-col sm:flex-row gap-5">
            <div className="w-full sm:w-1/2">
              <Title title="Datos de Contacto" />
              {me ? (
                <>
                  <div className="w-full ">
                    Correo
                    <div className="w-full border border-white p-2 rounded-md">
                      {me?.email ? me?.email : "N/A"}
                    </div>
                  </div>
                  <div className="w-full flex gap-3 mt-3">
                    <div className="w-full">
                      Nombre
                      <div className="w-full border border-white p-2 rounded-md">
                        {me?.name ? me?.name : "N/A"}
                      </div>
                    </div>
                    <div className="w-full">
                      Telefono
                      <div className="w-full border border-white p-2 rounded-md">
                        {me?.phone ? me?.phone : "N/A"}
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <h1>Necesitas iniciar sesion para continuar!</h1>
                  <Button
                    className="w-1/2 uppercase mt-2"
                    onClick={() => router.push(routes.login)}
                  >
                    Iniciar Sesión
                  </Button>
                </>
              )}
            </div>
            <div className="w-full h-full flex flex-col justify-between sm:w-1/2 border min-h-80 border-white rounded-lg p-5">
              {cart.length > 0 ? (
                cart.map((plataforma, i) => (
                  <div className="w-full flex mb-4" key={i}>
                    {/* Imagen */}
                    <div className="relative w-1/4 h-auto">
                      <Image
                        src={plataforma.image_url}
                        layout="fill"
                        quality={100}
                        alt="img banner"
                        className="rounded-2xl"
                      />
                    </div>

                    {/* Textos de disponibilidad y nombre */}
                    <div className="flex flex-col p-4 bg-opacity-50 w-1/4">
                      <div>
                        <div className="mb-4">
                          <span className="text-sm text-gray-300 block w-full">
                            <span className="text-gray-400">
                              ({plataforma.count_avaliable} {plataforma.type})
                            </span>
                          </span>
                          <h3 className="font-bold text-white md:text-2xl uppercase text-lg truncate">
                            {plataforma.name}
                          </h3>
                        </div>
                      </div>
                    </div>

                    <div className="w-1/4 flex justify-center items-center">
                      {/* Contador (cantidad) */}
                      <div className="flex items-center gap-2 w-3/4">
                        <button
                          className="w-full h-10 flex items-center text-2xl justify-center bg-gray-800 text-white rounded hover:bg-gray-700 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                          id="decrement"
                          aria-label="Disminuir cantidad"
                          onClick={() =>
                            updateCount({ type: "resta", plataforma })
                          }
                        >
                          -
                        </button>

                        <div className="w-full flex justify-center items-center">
                          {plataforma?.cantidad}
                        </div>

                        <button
                          className="w-full h-10 flex items-center justify-center text-2xl bg-brand text-white rounded hover:bg-brand/50 transition duration-200"
                          id="increment"
                          aria-label="Incrementar cantidad"
                          onClick={() =>
                            updateCount({ type: "suma", plataforma })
                          }
                        >
                          +
                        </button>
                      </div>
                    </div>

                    {/* Precio */}
                    <div className="p-4 flex flex-col justify-center w-1/4 items-center">
                      <p className="text-lg md:text-xl text-brand font-semibold">
                        {formatPrecioColombiano(
                          isProvider
                            ? String(
                                Number(plataforma.provider_price) *
                                  (plataforma.cantidad ?? 0)
                              )
                            : String(
                                Number(plataforma.public_price) *
                                  (plataforma.cantidad ?? 0)
                              )
                        )}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <h1>No hay items en el carrito</h1>
              )}
              {cart.length > 0 && (
                <div className="w-full flex flex-col items-center gap-2 border-t">
                  <div className="w-full max-w-[10rem] flex justify-between text-sm mt-2 gap-2">
                    <span className="font-bold">Subtotal</span>
                    <span> {formatPrecioColombiano(TotalCard())}</span>
                  </div>
                  <div className="w-full max-w-[10rem] flex justify-between text-xl gap-2">
                    <span className="font-bold">Total</span>
                    <span className="text-brand">
                      {formatPrecioColombiano(TotalCard())}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </Step>
        <Step isValid={isValid} title="Pago">
          <div className="w-full flex flex-col sm:flex-row gap-5">
            <div className="w-full sm:w-1/2">
              <Title title="Datos de Contacto" />
              <div className="w-full ">
                Correo
                <div className="w-full border border-white p-2 rounded-md">
                  {me?.email}
                </div>
              </div>
              <div className="w-full flex gap-3 mt-3">
                <div className="w-full">
                  Nombre
                  <div className="w-full border border-white p-2 rounded-md">
                    {me?.name}
                  </div>
                </div>
                <div className="w-full">
                  Telefono
                  <div className="w-full border border-white p-2 rounded-md">
                    {me?.phone ? me?.phone : "N/A"}
                  </div>
                </div>
              </div>

              <div className="w-full mt-5 flex flex-col gap-3">
                <Title title="Medios de Pago" />
                {isProvider ? (
                  <div
                    className="w-full flex gap-5 border border-white p-2 hover:bg-white hover:text-black cursor-pointer transition-colors rounded-2xl"
                    onClick={handleSuscription}
                  >
                    <WalletPointsIcon className="w-5 h-5" />
                    Billetera
                  </div>
                ) : (
                  <div className="w-full flex gap-5 border border-white p-2 hover:bg-white hover:text-black cursor-pointer transition-colors rounded-2xl" onClick={handlePaymentClient}>
                    <CartCheckBag className="w-5 h-5" />
                    Mercado Pago
                  </div>
                )}
              </div>
            </div>
            <div className="w-full h-full flex flex-col justify-between sm:w-1/2 border min-h-80 border-white rounded-lg p-5">
              {cart.map((plataforma, i) => (
                <div className="w-full flex mb-4" key={i}>
                  {/* Imagen */}
                  <div className="relative w-1/4 h-auto">
                    <Image
                      src={plataforma.image_url}
                      layout="fill"
                      quality={100}
                      alt="img banner"
                      className="rounded-2xl"
                    />
                  </div>

                  {/* Textos de disponibilidad y nombre */}
                  <div className="flex flex-col p-4 bg-opacity-50 w-1/4">
                    <div>
                      <div className="mb-4">
                        <span className="text-sm text-gray-300 block w-full">
                          <span className="text-gray-400">
                            ({plataforma.count_avaliable} {plataforma.type})
                          </span>
                        </span>
                        <h3 className="font-bold text-white md:text-2xl uppercase text-lg truncate">
                          {plataforma.name}
                        </h3>
                      </div>
                    </div>
                  </div>

                  <div className="w-1/4 flex justify-center items-center">
                    {/* Contador (cantidad) */}
                    <div className="flex items-center gap-2 w-3/4">
                      <button
                        className="w-full h-10 flex items-center text-2xl justify-center bg-gray-800 text-white rounded hover:bg-gray-700 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        id="decrement"
                        aria-label="Disminuir cantidad"
                        onClick={() =>
                          updateCount({ type: "resta", plataforma })
                        }
                      >
                        -
                      </button>

                      <div className="w-full flex justify-center items-center">
                        {plataforma?.cantidad}
                      </div>

                      <button
                        className="w-full h-10 flex items-center justify-center text-2xl bg-brand text-white rounded hover:bg-brand/50 transition duration-200"
                        id="increment"
                        aria-label="Incrementar cantidad"
                        onClick={() =>
                          updateCount({ type: "suma", plataforma })
                        }
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Precio */}
                  <div className="p-4 flex flex-col justify-center w-1/4 items-center">
                    <p className="text-lg md:text-xl text-brand font-semibold">
                      {formatPrecioColombiano(
                        isProvider
                          ? plataforma.provider_price
                          : plataforma.public_price
                      )}
                    </p>
                  </div>

                  {i !== cart.length - 1 && (
                    <div className="w-full border-b border-white"></div>
                  )}
                </div>
              ))}

              <div className="w-full flex flex-col items-center gap-2 border-t">
                <div className="w-full max-w-[10rem] flex justify-between text-sm mt-2 gap-2">
                  <span className="font-bold">Subtotal</span>
                  <span> {formatPrecioColombiano(TotalCard())}</span>
                </div>
                <div className="w-full max-w-[10rem] flex justify-between text-xl gap-2">
                  <span className="font-bold">Total</span>
                  <span className="text-brand">
                    {formatPrecioColombiano(TotalCard())}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </Step>
      </StepperComponent>
      <div></div>
      <div></div>
    </div>
  );
};

Checkout.getLayout = function getLayout(page: any) {
  return <Layout subFooter={true}>{page}</Layout>;
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { permissions } = getAuthCredentials(ctx);

  return {
    props: {
      userPermissions: permissions,
    },
  };
};

export default Checkout;
