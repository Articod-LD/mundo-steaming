import SearchModal from "@/layouts/topbar/search-modal";
import Modal from "./modal";
import { MODAL_VIEWS, useModalAction, useModalState } from "./modal.context";
import AgregatePlataformaModal from "@/components/modals/agregarPlataforma";
import AgregateClienteModal from "@/components/modals/agregarCliente";
import EditarPerfilModal from "@/components/modals/editarPerfil";
import CrearPlataformaModal from "@/components/modals/crearPlataforma";
import SolicitarPlataforma from "@/components/modals/solicitarPlataforma";
import DeleteSolicitud from "@/components/modals/deleteSolicitud";
import AceptarSolicitud from "@/components/modals/aceptarSolicitud";
import VerInfoPlataforma from "@/components/modals/verInfoPlataforma";
import AgregateProvidersModal from "@/components/modals/agregarProviders";
import CrearBannerModal from "@/components/modals/crearBanner";
import CrearCategoriaModal from "@/components/modals/createCategoria";
import EditarUsuarioModal from "@/components/modals/editarUsuario";
import CrearProductoModal from "@/components/modals/createproducto";
import BulkProductUploadModal from "@/components/modals/cargarProductos";

function renderModal(view: MODAL_VIEWS | undefined, data: any) {

  switch (view) {
    case "SEARCH_VIEW":
      return <SearchModal />;
    case "AGREGAR_PLATAFORMA_USUARIO":
      return <AgregatePlataformaModal id={data} />;

    case "AGREGAR_PLATAFORMA_CLIENTE":
      return <AgregateClienteModal type={data} />;

    case "EDITAR_USER_PROFILE":
      return <EditarPerfilModal />;

    case "CREAR_PLATAFORMA":
      return <CrearPlataformaModal plataforma={data} />;
    case "CREAR_PRODUCTO":
      return <CrearProductoModal producto={data} />;
    case "CARGA_PRODUCTO":
      return <BulkProductUploadModal />;

    case "CREAR_BANNER":
      return <CrearBannerModal banner={data} />;

    case "CREAR_CATEGORIA":
      return <CrearCategoriaModal categorie={data} />;

    case "CLIENTE_SOLICITAR_PLATAFORMA":
      return <SolicitarPlataforma plataforma={data} />;

    case "ELIMINAR_SOLICITUD":
      return <DeleteSolicitud id={data} />;

    case "ACEPTAR_SOLICITUD":
      return <AceptarSolicitud data={data} />;

    case "VER_INFO_PLATAFORMA":
      return <VerInfoPlataforma producto={data} />;

    case "PROVIDER_SOLICITAR_PLATAFORMA":
      return <AgregateProvidersModal />;

    case "EDITAR_USUARIO":
      return <EditarUsuarioModal data={data} />;

    default:
      return null;
  }
}

const ManagedModal = () => {
  const { isOpen, view, data } = useModalState();
  const { closeModal } = useModalAction();

  return (
    <Modal open={isOpen} onClose={closeModal}>
      {renderModal(view, data)}
    </Modal>
  );
};

export default ManagedModal;
