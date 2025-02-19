import { CloseIcon } from "@/components/icons/close-icon";
import Button from "@/components/ui/button";
import { useModalAction } from "@/components/ui/modal/modal.context";
import { useDeletePlataformaMutation, useDeleteProductoMutation } from "@/data/user";
import { Product } from "@/types";
import Image from "next/image";
import toast from "react-hot-toast";
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
const MySwal = withReactContent(Swal)

const ProductosAdmin = ({ productos }: { productos: Product[] }) => {

    const { mutate: deleteproductMutation } = useDeleteProductoMutation()
    const { openModal } = useModalAction();

    const handleDelete = (producto: Product) => {
        if (producto.status === 'COMPRADO') {
            toast.error('No puedes eliminar una plataforma comprada');
            return;
        }
        MySwal.fire({
            title: `Eliminar una Producto`,
            text: `Vas a eliminar un Producto estas seguro?`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Eliminar"
        }).then((result) => {
            if (result.isConfirmed) {

                deleteproductMutation({ productoId: producto.id }, {
                    onSuccess(data, variables, context) {
                        MySwal.fire({
                            title: "Deleted!",
                            icon: "success"
                        });
                    }, onError(error, variables, context) {
                        console.log(error);

                        toast.error('ha ocurrido un error')
                    },
                })


            }
        });

    }


    const hanldeCreate = () => {
        openModal("CREAR_PRODUCTO");
    }


    const hanldeUpdate = (producto: Product) => {
        openModal("CREAR_PRODUCTO", producto);
    }

    const handleSubmit = () => {
        openModal("CARGA_PRODUCTO");
    }

    return (
        <div className="w-full flex justify-center">
            <div className="w-full max-w-7xl bg-white rounded-lg shadow-xl overflow-hidden">
                <div className="overflow-x-auto">
                    {productos.length > 0 ? (
                        <>
                            {/* Encabezados de la Tabla */}
                            <div className="min-w-[800px] grid grid-cols-11 gap-4 px-6 py-4 bg-gray-100 text-brand font-semibold text-center">
                                <div className="col-span-1 text-lg"></div>
                                <div className="col-span-1 text-lg">Item</div>
                                <div className="col-span-1 text-lg">Tipo</div>
                                <div className="col-span-1 text-lg">Correo</div>
                                <div className="col-span-1 text-lg">Contraeña</div>
                                <div className="col-span-1 text-lg">Perfil</div>
                                <div className="col-span-1 text-lg">Contraseña Perfil</div>
                                <div className="col-span-1 text-lg">Fecha de Compra</div>
                                <div className="col-span-1 text-lg">Meses Comprados</div>
                                <div className="col-span-1 text-lg">Estado</div>
                                <div className="col-span-1 text-lg">Acciones</div>
                            </div>

                            {/* Filas de Datos */}
                            {
                                productos.map((producto, i) => (
                                    <div
                                        className="min-w-[800px] grid grid-cols-11 gap-4 px-6 items-center py-4 border-b border-gray-200 hover:bg-gray-50 transition duration-200 overflow-y-auto"
                                        key={i}
                                    >
                                        <div className="col-span-1 flex justify-center items-center">
                                            <button
                                                onClick={() => handleDelete(producto)}
                                                className="border-2 border-red-500 text-red-500 hover:bg-red-100 p-1 rounded-full transition duration-300"
                                            >
                                                <CloseIcon className="w-4 h-4" />
                                            </button>
                                        </div>
                                        {/* Imagen */}
                                        <div className="col-span-1 flex justify-center items-center">
                                            <div className="relative w-[80px] h-[40px] rounded-lg overflow-hidden shadow-lg bg-gray-200">
                                                <Image
                                                    src={producto.plataforma.image_url}
                                                    layout="fill"
                                                    objectFit="cover"
                                                    quality={100}
                                                    alt={`Plataforma`}
                                                    className="object-cover rounded-lg"
                                                />
                                            </div>
                                        </div>

                                        {/* Nombre */}
                                        <div className="col-span-1 text-center text-sm font-normal text-gray-800">
                                            {producto.plataforma.type}
                                        </div>

                                        {/* Nombre */}
                                        <div className="col-span-1 text-center text-sm font-normal text-gray-800">
                                            {producto.credencial.email}
                                        </div>

                                        {/* Public Price */}
                                        <div className="col-span-1 text-center text-sm font-normal text-gray-800">
                                            <span className="relative group">
                                                <span className="absolute inset-0 bg-gray-200 opacity-100 group-hover:opacity-0">
                                                    ********
                                                </span>
                                                <span className="absolute inset-0 bg-gray-200 opacity-0 group-hover:opacity-100">
                                                    {producto.credencial.password}
                                                </span>
                                            </span>
                                        </div>
                                        {/* Provider Price */}
                                        <div className="col-span-1 text-center text-sm font-normal text-gray-800">
                                            {producto.profile_name ? producto.profile_name : "-"}
                                        </div>

                                        {/* Type */}
                                        <div className="col-span-1 text-center text-sm font-normal text-gray-800">
                                            <span className="relative group">
                                                {/* Si el valor de profile_pin está vacío o es undefined, mostramos el guion */}
                                                <span className={`absolute inset-0 bg-gray-200 opacity-100 ${producto.profile_pin ? 'group-hover:opacity-0' : ''}`}>
                                                    {producto.profile_pin ? '********' : '-'} {/* Si hay datos, mostramos los asteriscos; si no, el guion */}
                                                </span>

                                                {/* Si el valor de profile_pin existe, mostramos la contraseña real al hacer hover */}
                                                <span className={`absolute inset-0 bg-gray-200 opacity-0 ${producto.profile_pin ? 'group-hover:opacity-100' : ''}`}>
                                                    {producto.profile_pin} {/* Aquí se muestra la contraseña real */}
                                                </span>
                                            </span>
                                        </div>


                                        {/* Credenciales */}
                                        <div className="col-span-1 text-center text-sm font-normal text-gray-800">
                                            {producto.purchase_date}
                                        </div>

                                        {/* Productos */}
                                        <div className="col-span-1 text-center text-sm font-normal text-gray-800">
                                            {producto.months}
                                        </div>
                                        <div className="col-span-1 text-center text-sm font-normal text-gray-800">
                                            {producto.status}
                                        </div>

                                        {/* Estado */}
                                        <div className="col-span-1 flex justify-center items-center flex-col gap-2">
                                            <Button
                                                variant="outline"
                                                onClick={() => hanldeUpdate(producto)}
                                                className="py-2 px-4 border-2 border-[#FFB422] rounded-2xl text-[#FFB422] hover:bg-[#FFB422] hover:text-white transition-colors duration-300"
                                            >
                                                Actualizar
                                            </Button>
                                        </div>
                                    </div>
                                ))
                            }

                        </>
                    ) : (
                        <div className="w-full h-[400px] flex justify-center items-center bg-gray-100">
                            <div className="text-center text-xl font-semibold text-gray-700">
                                <p>No tenemos plataformas registradas en este momento</p>
                                <p className="text-sm text-gray-500">registra plataformas para verlas en esta seccion.</p>
                            </div>
                        </div>
                    )}
                </div>


                {/* Botón para Agregar Plataforma */}
                <div className="flex items-center justify-end p-6 gap-4">
                    <a
                        download='plantilla-carga-productos.xlsx'
                        href="/Book.xlsx"
                        className="p-3 bg-blue-800 rounded-xl text-white text-lg font-semibold uppercase transition ease-in-out hover:scale-105 hover:bg-blue-900 duration-300"
                    >
                        Descargar Plantilla
                    </a>
                    <button
                    onClick={handleSubmit}
                        className="p-3 bg-green-800 rounded-xl text-white text-lg font-semibold uppercase transition ease-in-out hover:scale-105 hover:bg-green-900 duration-300"
                    >
                        Importar Excel
                    </button>
                    <button
                        onClick={hanldeCreate}
                        className="p-3 bg-brand rounded-xl text-white text-lg font-semibold uppercase transition ease-in-out hover:scale-105 hover:bg-yellow-600 duration-300"
                    >
                        + Agregar Producto
                    </button>
                </div>
            </div>
        </div>




    );
}

export default ProductosAdmin;