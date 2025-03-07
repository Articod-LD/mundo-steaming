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
import RecargarBilletera from "@/components/modals/RecargaBilletera";
import CrearConfigModal from "@/components/modals/createConfiguracion";
import CrearAboutModal from "@/components/modals/crearAbout";
import CrearBeneficioModal from "@/components/modals/crearBeneficios";

function renderModal(view: MODAL_VIEWS | undefined, data: any) {
  const modalKey = `${view}-${data?.id || ''}`;  
  switch (view) {
    case "SEARCH_VIEW":
      return <SearchModal key={modalKey} />;
    case "AGREGAR_PLATAFORMA_USUARIO":
      return <AgregatePlataformaModal id={data}  key={modalKey}/>;

    case "AGREGAR_PLATAFORMA_CLIENTE":
      return <AgregateClienteModal type={data}  key={modalKey} />;

    case "EDITAR_USER_PROFILE":
      return <EditarPerfilModal  key={modalKey} />;

    case "CREAR_PLATAFORMA":
      return <CrearPlataformaModal plataforma={data}  key={modalKey}/>;
    case "CREAR_PRODUCTO":
      return <CrearProductoModal producto={data} key={modalKey} />;
    case "CARGA_PRODUCTO":
      return <BulkProductUploadModal  key={modalKey}/>;

    case "CREAR_BANNER":
      return <CrearBannerModal banner={data}  key={modalKey}/>;

    case "CREAR_CATEGORIA":
      return <CrearCategoriaModal categorie={data}  key={modalKey}/>;

    case "CLIENTE_SOLICITAR_PLATAFORMA":
      return <SolicitarPlataforma plataforma={data} key={modalKey} />;

    case "ELIMINAR_SOLICITUD":
      return <DeleteSolicitud id={data}  key={modalKey}/>;

    case "ACEPTAR_SOLICITUD":
      return <AceptarSolicitud data={data}  key={modalKey}/>;

    case "VER_INFO_PLATAFORMA":
      return <VerInfoPlataforma producto={data}  key={modalKey}/>;

    case "PROVIDER_SOLICITAR_PLATAFORMA":
      return <AgregateProvidersModal key={modalKey} />;

    case "EDITAR_USUARIO":
      return <EditarUsuarioModal data={data}  key={modalKey} />;

      
    case "BILLETERA_MANUAL":
      return <RecargarBilletera data={data}  key={modalKey} />;
      
     case "CONFIGURACIONES":
      return <CrearConfigModal config={data}  key={modalKey}/> 

      case "ABOUT_MODAL":
        return <CrearAboutModal about={data}  key={modalKey}/>

      case "BENEFICIO_MODAL":
        return <CrearBeneficioModal beneficios={data} key={modalKey}/>

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
