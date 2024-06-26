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
  RegisterInput,
  SolicitudInput,
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
    userId: string;
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
  fetchCategories: ({ ...params }: Partial<UserQueryOptions>) => {
    return HttpClient.get<Categorie[]>(API_ENDPOINTS.CATEGORIE_LIST, {
      ...params,
    });
  },
  fetchBanner: ({ ...params }: Partial<UserQueryOptions>) => {
    return HttpClient.get<Banner[]>(API_ENDPOINTS.BANNER_LIST, {
      ...params,
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
};
