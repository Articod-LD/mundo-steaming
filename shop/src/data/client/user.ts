import {
  AceptarSolicitudInput,
  AuthResponse,
  Banner,
  BannerInput,
  Categorie,
  ChangePasswordInput,
  CrearSuscripcionInput,
  ISolicitud,
  ISolicitudPaginator,
  LoginInput,
  Plataforma,
  PlataformaInput,
  PlataformasPaginator,
  ProductPaginator,
  Recharge,
  RegisterInput,
  RegisterProductInput,
  SolicitudInput,
  Suscriptions,
  SuscriptionSuccess,
  UpdateProfileInputType,
  User,
  UserPaginator,
  UserQueryOptions,
  walletInput,
} from "@/types";
import { HttpClient } from "./http-client";
import { API_ENDPOINTS } from "./api-endpoints";

export const userClient = {
  login: (variables: LoginInput) => {
    return HttpClient.post<AuthResponse>(API_ENDPOINTS.TOKEN, variables);
  },
  register: (variables: RegisterInput) => {
    return HttpClient.post<AuthResponse>(API_ENDPOINTS.REGISTER, variables);
  },
  registerProduct: (variables: RegisterProductInput) => {
    return HttpClient.post<any>(API_ENDPOINTS.ONE_PRODUCTOS + 'register', variables);
  },
  registerAdmin: (variables: RegisterInput) => {
    return HttpClient.post<AuthResponse>(API_ENDPOINTS.ONE_ADMIN + 'register', variables);
  },
  registerProvider: (variables: RegisterInput) => {
    return HttpClient.post<AuthResponse>(API_ENDPOINTS.ONE_PROVIDER + 'register', variables);
  },
  logout: () => {
    return HttpClient.post<any>(API_ENDPOINTS.LOGOUT, {});
  },

  updateProfile: ({
    userId,
    variables,
  }: {
    variables: UpdateProfileInputType;
    userId: string;
  }) => {
    return HttpClient.post<any>(
      API_ENDPOINTS.UPDATE_PROFILE + userId,
      variables
    );
  },
  changePassword: ({
    variables,
    userId,
  }: {
    variables: ChangePasswordInput;
    userId: number;
  }) => {
    return HttpClient.post<AuthResponse>(
      API_ENDPOINTS.CHANGE_PASS + userId,
      variables
    );
  },
  me: () => {
    return HttpClient.get<any>(API_ENDPOINTS.ME);
  },
  fetchClients: ({ ...params }: Partial<UserQueryOptions>) => {
    return HttpClient.get<UserPaginator>(API_ENDPOINTS.CLIENT_LIST, {
      ...params,
    });
  },
  fetchProductos: ({ ...params }: Partial<UserQueryOptions>) => {
    return HttpClient.get<ProductPaginator>(API_ENDPOINTS.PRODUCTS_LIST, {
      ...params,
    });
  },
  fetchAdmins: ({ ...params }: Partial<UserQueryOptions>) => {
    return HttpClient.get<UserPaginator>(API_ENDPOINTS.ADMIN_LIST, {
      ...params,
    });
  },
  fetchProviders: ({ ...params }: Partial<UserQueryOptions>) => {
    return HttpClient.get<UserPaginator>(API_ENDPOINTS.PROVIDERS_LIST, {
      ...params,
    });
  },

  fetchSolicitudes: ({ ...params }: Partial<UserQueryOptions>) => {
    return HttpClient.get<ISolicitudPaginator>(API_ENDPOINTS.SOLICITUDES_LIST, {
      ...params,
    });
  },

  fetchPreguntas: ({ ...params }: Partial<UserQueryOptions>) => {
    return HttpClient.get<ISolicitudPaginator>(API_ENDPOINTS.SOPORTE_LIST, {
      ...params,
    });
  },

  fetchOneClients: (params: Partial<{ ClientId: string }>) => {
    return HttpClient.get<User>(API_ENDPOINTS.ONE_CLIENT + params.ClientId);
  },
  fetchPlataformas: ({ ...params }: Partial<UserQueryOptions>) => {
    return HttpClient.get<Plataforma[]>(API_ENDPOINTS.PLATAFORMA_LIST, {
      ...params,
    });
  },

  fetchRechargedAdmin: () => {
    return HttpClient.get<Recharge[]>(API_ENDPOINTS.RECHARGE_ONE + 'list');
  },

  fetchSuscriptionAdmin: ({orden_code }: Partial<{orden_code:string}>) => {
    return HttpClient.get<any>(API_ENDPOINTS.SUSCRIPCION_ONE + orden_code);
  },

  fetchRecharged: ({user_id }: Partial<{user_id:number}>) => {
    return HttpClient.get<Recharge[]>(API_ENDPOINTS.RECHARGE_ONE + user_id);
  },
  fetchCategories: ({ ...params }: Partial<UserQueryOptions>) => {
    return HttpClient.get<Categorie[]>(API_ENDPOINTS.CATEGORIE_LIST, {
      ...params,
    });
  },
  fetchCategoriesPlataformas: ({ ...params }: Partial<{name:string}>) => {
    return HttpClient.get<Plataforma[]>(`${API_ENDPOINTS.DELETE_CATEGORIA}${params.name}/plataformas`);
  },
  fetchBanner: ({ ...params }: Partial<UserQueryOptions>) => {
    return HttpClient.get<Banner[]>(API_ENDPOINTS.BANNER_LIST, {
      ...params,
    });
  },

  deleteBanner: (params: Partial<{ bannerId: number }>) => {
    return HttpClient.delete(API_ENDPOINTS.BANNER_DELETE + params.bannerId);
  },

  deleteCategoria: (params: Partial<{ categorieId: number }>) => {
    return HttpClient.delete(API_ENDPOINTS.DELETE_CATEGORIA + params.categorieId);
  },
  deleteClient: (params: Partial<{ clientId: number }>) => {
    return HttpClient.delete(API_ENDPOINTS.ONE_CLIENT + params.clientId);
  },
  deletePlataforma: (params: Partial<{ plataformaId: number }>) => {
    return HttpClient.delete(API_ENDPOINTS.ONE_PLATAFORMA + params.plataformaId);
  },

  deleteProducto: (params: Partial<{ productoId: number }>) => {
    return HttpClient.delete(API_ENDPOINTS.ONE_PRODUCTOS + params.productoId);
  },

  deleteAdmin: (params: Partial<{ adminId: number }>) => {
    return HttpClient.delete(API_ENDPOINTS.ONE_ADMIN + params.adminId);
  },
  deleteProveedor: (params: Partial<{ providerId: number }>) => {
    return HttpClient.delete(API_ENDPOINTS.ONE_PROVIDER + params.providerId);
  },

  updateCategoria: (params: Partial<{ categoriaId: number, params: any }>) => {

    return HttpClient.post(API_ENDPOINTS.DELETE_CATEGORIA + params.categoriaId, params.params, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },

  updatePlataforma: (params: Partial<{ plataformaId: number, params: any }>) => {

    return HttpClient.post(API_ENDPOINTS.ONE_PLATAFORMA + params.plataformaId, params.params, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },

  updateProducto: (params: Partial<{ productoId: number, params: RegisterProductInput }>) => {
    return HttpClient.post(API_ENDPOINTS.ONE_PRODUCTOS + params.productoId, params.params);
  },

  updateClient: (params: Partial<{ clientId: number, params: any }>) => {
    return HttpClient.post(API_ENDPOINTS.ONE_CLIENT + params.clientId, params.params);
  },

  updateAdmin: (params: Partial<{ adminId: number, params: any }>) => {
    return HttpClient.post(API_ENDPOINTS.ONE_ADMIN + params.adminId, params.params);
  },


  updateProvider: (params: Partial<{ providerId: number, params: any }>) => {
    return HttpClient.post(API_ENDPOINTS.ONE_PROVIDER + params.providerId, params.params);
  },

  updateBanner: (params: Partial<{ bannerId: number, params: any }>) => {
    return HttpClient.post(API_ENDPOINTS.BANNER_DELETE + params.bannerId, params.params, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },
  fetchDisponibles: ({ ...params }: Partial<UserQueryOptions>) => {
    return HttpClient.get<Plataforma[]>(API_ENDPOINTS.PLATAFORMA_DISPONIBLES, {
      ...params,
    });
  },

  registerPlataforma: (variables: FormData) => {
    return HttpClient.post<Plataforma>(
      API_ENDPOINTS.PLATAFORMA_REGISTER,
      variables,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
  },

  registerBanner: (variables: FormData): Promise<Banner> => {
    return HttpClient.post<Banner>(API_ENDPOINTS.BANNER_REGISTER, variables, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },
  registerCategorie: (variables: FormData): Promise<Categorie> => {
    return HttpClient.post<Banner>(
      API_ENDPOINTS.CATEGORIE_REGISTER,
      variables,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
  },

  registerCargaMasivaProductos: (variables: FormData): Promise<any> => {
    return HttpClient.post<any>(
      API_ENDPOINTS.ONE_PRODUCTOS + 'carga-masiva/register',
      variables,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
  },
  registerSolicitud: (variables: SolicitudInput) => {
    return HttpClient.post<ISolicitud>(
      API_ENDPOINTS.CREATE_SOLICITUD,
      variables
    );
  },

  deleteSolicitudes: ({ solicitud_id }: { solicitud_id: string }) => {
    return HttpClient.delete<any>(
      API_ENDPOINTS.DELETE_SOLICITUD + solicitud_id
    );
  },

  aceptarSolicitud: ({
    variables,
    solicitud_id,
  }: {
    variables: AceptarSolicitudInput;
    solicitud_id: String;
  }) => {
    return HttpClient.post<any>(
      API_ENDPOINTS.ACEPTAR_SOLICITUD + solicitud_id,
      variables
    );
  },

  crearSuscripcion: ({ variables }: { variables: CrearSuscripcionInput }) => {
    return HttpClient.post<any>(API_ENDPOINTS.CREAR_SUSCRIPCION, variables);
  },

  updatewalletClient({ variables }: { variables: walletInput }) {
    return HttpClient.post<any>(API_ENDPOINTS.UPDATE_WALLET_CLIENT, variables);
  },

  soporte: (variables: any) => {
    return HttpClient.post<AuthResponse>(API_ENDPOINTS.SOPORTE, variables);
  },

  recharge: (variables: any) => {
    return HttpClient.post<AuthResponse>(API_ENDPOINTS.RECHARGE, variables);
  },

  rechargeManual: (variables: any) => {
    return HttpClient.post<AuthResponse>(API_ENDPOINTS.RECHARGE+ '/manual', variables);
  },
  
  suscriptionClient: (variables: any) => {
    return HttpClient.post<AuthResponse>(API_ENDPOINTS.CREAR_SUSCRIPCION_CLIENT, variables);
  },
};
