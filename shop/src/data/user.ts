import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { userClient } from "./client/user";
import { API_ENDPOINTS } from "./client/api-endpoints";
import toast from "react-hot-toast";
import { useRouter } from "next/router";

import Cookies from "js-cookie";

import routes from "@/config/routes";
import useAuth from "@/components/auth/use-auth";
import {
  Banner,
  Beneficio,
  Categorie,
  IAbout,
  IConfig,
  ISolicitudPaginator,
  ISuscrption,
  Plataforma,
  PlataformasPaginator,
  ProductPaginator,
  QueryOptionsType,
  Recharge,
  Suscriptions,
  SuscriptionSuccess,
  User,
  UserPaginator,
} from "@/types";
import { mapPaginatorData } from "@/utils/date-mapper";
import { Config } from "tailwindcss";
const AUTH_TOKEN_KEY = process.env.NEXT_PUBLIC_AUTH_TOKEN_KEY ?? "authToken";
export function useMe() {
  const { isAuthorized } = useAuth();

  const { data, isLoading, error } = useQuery<User, Error>(
    [API_ENDPOINTS.ME],
    userClient.me,
    {
      enabled: isAuthorized,
    }
  );
  return {
    isAuthorized,
    me: data,
    isLoading,
    error,
  };
}

export function useLogin() {
  return useMutation({
    mutationFn: userClient.login,
  });
}

export function useSoporte() {
  return useMutation({
    mutationFn: userClient.soporte,
    onSuccess() {
      toast.success("Pregunta Enviada Correctamente");
    },
  });
}

export function useRegisterWallet() {
  return useMutation({
    mutationFn: userClient.recharge,
  });
}

export function useRegisterWalletManual() {
  return useMutation({
    mutationFn: userClient.rechargeManual,
  });
}

export function useRegisterSuscriptionClient() {
  return useMutation({
    mutationFn: userClient.suscriptionClient,
  });
}

export const useRegisterMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: userClient.register,
    onSuccess() {
      toast.success("Registrado Correctamente");
    },
    onSettled() {
      queryClient.invalidateQueries([API_ENDPOINTS.CLIENT_LIST]);
    },
  });
};

export const useProductRegisterMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: userClient.registerProduct,
    onSuccess() {
      toast.success("Registrado Correctamente");
    },
    onSettled() {
      queryClient.invalidateQueries([API_ENDPOINTS.PRODUCTS_LIST]);
    },
  });
};

export const useRegisterAdminMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: userClient.registerAdmin,
    onSuccess() {
      toast.success("Registrado Correctamente");
    },
    onSettled() {
      queryClient.invalidateQueries([API_ENDPOINTS.ADMIN_LIST]);
    },
  });
};

export const useRegisterProviderMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: userClient.registerProvider,
    onSuccess() {
      toast.success("Registrado Correctamente");
    },
    onSettled() {
      queryClient.invalidateQueries([API_ENDPOINTS.PROVIDERS_LIST]);
    },
  });
};

export const useUpdateProfileMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: userClient.updateProfile,
    onSuccess() {
      toast.success("Datos Actualizados Correctamente");
    },
    onSettled() {
      queryClient.invalidateQueries({
        queryKey: [API_ENDPOINTS.UPDATE_PROFILE],
      });
    },
  });
};

export const useLogoutMutation = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: userClient.logout,
    onSuccess: () => {
      localStorage.removeItem("cart");
      Cookies.remove(AUTH_TOKEN_KEY);
      router.replace(routes.login);
    },
  });
};

export const useClientsQuery = (params: Partial<QueryOptionsType>) => {
  const { data, isLoading, error } = useQuery<UserPaginator, Error>(
    [API_ENDPOINTS.CLIENT_LIST, params],
    () => userClient.fetchClients(params),
    {
      keepPreviousData: true,
    }
  );

  return {
    clients: data?.data ?? [],
    paginatorInfo: mapPaginatorData(data as any),
    loading: isLoading,
    error,
  };
};

export const useSuscriptionQuery = () => {
  const { data, isLoading, error } = useQuery<ISuscrption[]>(
    [API_ENDPOINTS.SUSCRIPTION_LIST],
    () => userClient.fetchSuscriptions(),
    {
      keepPreviousData: true,
    }
  );

  return {
    suscripcions: data ?? ([] as ISuscrption[]),
    loading: isLoading,
    error,
  };
};

export const useProductsQuery = (params: Partial<QueryOptionsType>) => {
  const { data, isLoading, error } = useQuery<ProductPaginator, Error>(
    [API_ENDPOINTS.PRODUCTS_LIST, params],
    () => userClient.fetchProductos(params),
    {
      keepPreviousData: true,
    }
  );

  return {
    products: data?.data ?? [],
    paginatorInfo: mapPaginatorData(data as any),
    loading: isLoading,
    error,
  };
};

export const useAdminsQuery = (params: Partial<QueryOptionsType>) => {
  const { data, isLoading, error } = useQuery<UserPaginator, Error>(
    [API_ENDPOINTS.ADMIN_LIST, params],
    () => userClient.fetchAdmins(params),
    {
      keepPreviousData: true,
    }
  );

  return {
    admins: data?.data ?? [],
    paginatorInfo: mapPaginatorData(data as any),
    loading: isLoading,
    error,
  };
};

export const useProvidersQuery = (params: Partial<QueryOptionsType>) => {
  const { data, isLoading, error } = useQuery<UserPaginator, Error>(
    [API_ENDPOINTS.PROVIDERS_LIST, params],
    () => userClient.fetchProviders(params),
    {
      keepPreviousData: true,
    }
  );

  return {
    providers: data?.data ?? [],
    paginatorInfo: mapPaginatorData(data as any),
    loading: isLoading,
    error,
  };
};

export const useSolicitudesQuery = (params: Partial<QueryOptionsType>) => {
  const { data, isLoading, error } = useQuery<ISolicitudPaginator, Error>(
    [API_ENDPOINTS.SOLICITUDES_LIST, params],
    () => userClient.fetchSolicitudes(params),
    {
      keepPreviousData: true,
    }
  );

  return {
    solicitudes: data?.data ?? [],
    paginatorInfo: mapPaginatorData(data as any),
    loading: isLoading,
    error,
  };
};

export const usePreguntasQuery = (params: Partial<QueryOptionsType>) => {
  const { data, isLoading, error } = useQuery<ISolicitudPaginator, Error>(
    [API_ENDPOINTS.SOPORTE_LIST, params],
    () => userClient.fetchPreguntas(params),
    {
      keepPreviousData: true,
    }
  );

  return {
    solicitudes: data?.data ?? [],
    paginatorInfo: mapPaginatorData(data as any),
    loading: isLoading,
    error,
  };
};

export const usePlataformasQuery = (params: Partial<QueryOptionsType>) => {
  const { data, isLoading, error } = useQuery<Plataforma[], Error>(
    [API_ENDPOINTS.PLATAFORMA_LIST, params],
    () => userClient.fetchPlataformas(params),
    {
      keepPreviousData: true,
    }
  );
  return {
    plataformas: data ?? ([] as Plataforma[]),
    loading: isLoading,
    error,
  };
};

export const useRecargasAdminQuery = () => {
  const { data, isLoading, error } = useQuery<Recharge[], Error>(
    [API_ENDPOINTS.RECHARGE_ONE],
    () => userClient.fetchRechargedAdmin(),
    {
      keepPreviousData: true,
    }
  );
  return {
    rechages: data ?? ([] as Recharge[]),
    loading: isLoading,
    error,
  };
};

export const useSuscriptionAdminQuery = (params: { orden_code: string }) => {
  const { data, isLoading, error } = useQuery<any, Error>(
    [API_ENDPOINTS.SUSCRIPCION_ONE],
    () => userClient.fetchSuscriptionAdmin(params),
    {
      keepPreviousData: true,
    }
  );
  console.log(data);

  return {
    suscription: data ?? ({} as SuscriptionSuccess),
    loading: isLoading,
    error,
  };
};

export const useRecargasQuery = (params: Partial<{ user_id: number }>) => {
  const { data, isLoading, error } = useQuery<Recharge[], Error>(
    [API_ENDPOINTS.RECHARGE_ONE],
    () => userClient.fetchRecharged(params),
    {
      keepPreviousData: true,
    }
  );
  return {
    rechages: data ?? ([] as Recharge[]),
    loading: isLoading,
    error,
  };
};

export const useCategoriesQuery = (params: Partial<QueryOptionsType>) => {
  const { data, isLoading, error } = useQuery<Categorie[], Error>(
    [API_ENDPOINTS.CATEGORIE_LIST, params],
    () => userClient.fetchCategories(params),
    {
      keepPreviousData: true,
    }
  );

  return {
    categories: data ?? ([] as Categorie[]),
    loading: isLoading,
    error,
  };
};

export const useBeneficiosQuery = (params: Partial<QueryOptionsType>) => {
  const { data, isLoading, error } = useQuery<Beneficio[], Error>(
    [API_ENDPOINTS.BENEFICIOS_LIST, params],
    () => userClient.fetchBeneficios(params),
    {
      keepPreviousData: true,
    }
  );

  return {
    beneficios: data ?? ([] as Beneficio[]),
    loading: isLoading,
    error,
  };
};

export const useAboutQuery = (params: Partial<QueryOptionsType>) => {
  const { data, isLoading, error } = useQuery<IAbout, Error>(
    [API_ENDPOINTS.ABOUT_LIST, params],
    () => userClient.fetchAbout(params),
    {
      keepPreviousData: true,
    }
  );

  return {
    about: data ?? ({} as IAbout),
    loading: isLoading,
    error,
  };
};

export const useConfiguracionQuery = (params: Partial<QueryOptionsType>) => {
  const { data, isLoading, error } = useQuery<IConfig, Error>(
    [API_ENDPOINTS.CONFIG_LIST, params],
    () => userClient.fetchConfiguracion(params),
    {
      keepPreviousData: true,
    }
  );

  return {
    configuracion: data ?? ({} as IConfig),
    loading: isLoading,
    error,
  };
};

export const usePlataformasCategoriasQuery = (
  params: Partial<{ name: string }>
) => {
  const { data, isLoading, error } = useQuery<Plataforma[], Error>(
    [API_ENDPOINTS.CATEGORIE_LIST, params],
    () => userClient.fetchCategoriesPlataformas(params),
    {
      keepPreviousData: true,
    }
  );

  return {
    plataformas: data ?? ([] as Plataforma[]),
    loading: isLoading,
    error,
  };
};

export const useBannerQuery = (params: Partial<QueryOptionsType>) => {
  const { data, isLoading, error } = useQuery<Banner[], Error>(
    [API_ENDPOINTS.BANNER_LIST, params],
    () => userClient.fetchBanner(params),
    {
      keepPreviousData: true,
    }
  );

  return {
    banner: data ?? ([] as Banner[]),
    loading: isLoading,
    error,
  };
};

export const usePlataformasDisponiblesQuery = (
  params: Partial<QueryOptionsType>
) => {
  const { data, isLoading, error } = useQuery<Plataforma[], Error>(
    [API_ENDPOINTS.PLATAFORMA_DISPONIBLES, params],
    () => userClient.fetchDisponibles(params),
    {
      keepPreviousData: true,
    }
  );

  return {
    plataformas: data ?? [],
    paginatorInfo: mapPaginatorData(data as any),
    loading: isLoading,
    error,
  };
};

export const useOneClientsQuery = (params: Partial<{ ClientId: string }>) => {
  const { data, isLoading, error } = useQuery<User, Error>(
    [API_ENDPOINTS.ONE_CLIENT, params],
    () => userClient.fetchOneClients(params),
    {
      keepPreviousData: true,
    }
  );

  return {
    client: data ?? ({} as User),
    loading: isLoading,
    error,
  };
};

export const useChangePassMutation = () => {
  return useMutation({
    mutationFn: userClient.changePassword,
    onSuccess: () => {
      toast.success("contraseña cambiada correctamente");
    },
  });
};

export const useDeleteSolicitudMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: userClient.deleteSolicitudes,
    onSuccess: () => {
      toast.success("Se ha rechazado la Solicitud");
    },

    onSettled() {
      queryClient.invalidateQueries({
        queryKey: [API_ENDPOINTS.SOLICITUDES_LIST],
      });
    },
  });
};

export const useRegisterPlataformaMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: userClient.registerPlataforma,
    onSuccess() {
      toast.success("Registrado Correctamente");
    },
    onSettled() {
      queryClient.invalidateQueries({
        queryKey: [API_ENDPOINTS.PLATAFORMA_LIST],
      });
    },
  });
};

export const useRegisterBannerMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: userClient.registerBanner,
    onSuccess() {
      toast.success("Registrado Correctamente");
    },
    onSettled() {
      queryClient.invalidateQueries({
        queryKey: [API_ENDPOINTS.BANNER_LIST],
      });
    },
  });
};

export const useUpdateBannerMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: userClient.updateBanner,
    onSuccess() {
      toast.success("Actualizado Correctamente");
    },
    onSettled() {
      queryClient.invalidateQueries({
        queryKey: [API_ENDPOINTS.BANNER_LIST],
      });
    },
  });
};

export const useUpdateCategoriaMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: userClient.updateCategoria,
    onSuccess() {
      toast.success("Actualizado Correctamente");
    },
    onSettled() {
      queryClient.invalidateQueries({
        queryKey: [API_ENDPOINTS.CATEGORIE_LIST],
      });
    },
  });
};

export const useUpdatePlataformaMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: userClient.updatePlataforma,
    onSuccess() {
      toast.success("Actualizado Correctamente");
    },
    onSettled() {
      queryClient.invalidateQueries({
        queryKey: [API_ENDPOINTS.PLATAFORMA_LIST],
      });
    },
  });
};

export const useUpdateProductoMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: userClient.updateProducto,
    onSuccess() {
      toast.success("Actualizado Correctamente");
    },
    onSettled() {
      queryClient.invalidateQueries({
        queryKey: [API_ENDPOINTS.PRODUCTS_LIST],
      });
    },
  });
};

export const useUpdateClientMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: userClient.updateClient,
    onSuccess() {
      toast.success("Actualizado Correctamente");
    },
    onSettled() {
      queryClient.invalidateQueries({
        queryKey: [API_ENDPOINTS.CLIENT_LIST],
      });
    },
  });
};

export const useUpdateAdministradortMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: userClient.updateAdmin,
    onSuccess() {
      toast.success("Actualizado Correctamente");
    },
    onSettled() {
      queryClient.invalidateQueries({
        queryKey: [API_ENDPOINTS.ADMIN_LIST],
      });
    },
  });
};

export const useUpdateProvidertMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: userClient.updateProvider,
    onSuccess() {
      toast.success("Actualizado Correctamente");
    },
    onSettled() {
      queryClient.invalidateQueries({
        queryKey: [API_ENDPOINTS.PROVIDERS_LIST],
      });
    },
  });
};

export const useDeleteBannerMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: userClient.deleteBanner,
    onSettled() {
      queryClient.invalidateQueries({
        queryKey: [API_ENDPOINTS.BANNER_LIST],
      });
    },
  });
};

export const useDeleteCategoriaMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: userClient.deleteCategoria,
    onSettled() {
      queryClient.invalidateQueries({
        queryKey: [API_ENDPOINTS.CATEGORIE_LIST],
      });
    },
  });
};

export const useDeleteClientMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: userClient.deleteClient,
    onSettled() {
      queryClient.invalidateQueries({
        queryKey: [API_ENDPOINTS.CLIENT_LIST],
      });
    },
  });
};

export const useDeletePlataformaMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: userClient.deletePlataforma,
    onSettled() {
      queryClient.invalidateQueries({
        queryKey: [API_ENDPOINTS.PLATAFORMA_LIST],
      });
    },
  });
};

export const useDeleteProductoMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: userClient.deleteProducto,
    onSettled() {
      queryClient.invalidateQueries({
        queryKey: [API_ENDPOINTS.PRODUCTS_LIST],
      });
    },
  });
};

export const useAdminClientMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: userClient.deleteAdmin,
    onSettled() {
      queryClient.invalidateQueries({
        queryKey: [API_ENDPOINTS.ADMIN_LIST],
      });
    },
  });
};

export const useAdminProvedorMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: userClient.deleteProveedor,
    onSettled() {
      queryClient.invalidateQueries({
        queryKey: [API_ENDPOINTS.PROVIDERS_LIST],
      });
    },
  });
};

export const useRegisterCategorieMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: userClient.registerCategorie,
    onSuccess() {
      toast.success("Registrado Correctamente");
    },
    onSettled() {
      queryClient.invalidateQueries({
        queryKey: [API_ENDPOINTS.CATEGORIE_REGISTER],
      });
    },
  });
};

export const useRegisterProductsCargaMasivaMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: userClient.registerCargaMasivaProductos,
    onSuccess() {
      toast.success("Registrado Correctamente");
    },
    onSettled() {
      queryClient.invalidateQueries({
        queryKey: [API_ENDPOINTS.PRODUCTS_LIST],
      });
    },
  });
};

export const useRegisterSolicitudMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: userClient.registerSolicitud,
    onSuccess() {
      toast.success(
        "Registrado Correctamente esta en estado pendiente, cuando el administrador acepte tu solicitud te notificaremos!!",
        { duration: 5000 }
      );
    },
    onSettled() {
      queryClient.invalidateQueries({
        queryKey: [API_ENDPOINTS.ME],
      });
    },
  });
};

export const useAceptarSolicitudMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: userClient.aceptarSolicitud,
    onSuccess() {
      toast.success(
        "La solicitud ha sido aceptada correctamente, se ha creado una suscripcion",
        { duration: 5000 }
      );
    },
    onSettled() {
      queryClient.invalidateQueries({
        queryKey: [API_ENDPOINTS.SOLICITUDES_LIST],
      });
    },
  });
};

export const useCreateSuscripcionMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: userClient.crearSuscripcion,
    onSuccess(data, variables, context) {
      queryClient.invalidateQueries({
        queryKey: [API_ENDPOINTS.ME],
      });

      queryClient.invalidateQueries({
        queryKey: [API_ENDPOINTS.PLATAFORMA_DISPONIBLES],
      });
    },
  });
};

export const useUpdateWalletMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: userClient.updatewalletClient,
    onSuccess() {
      toast.success("Datos Actualizados Correctamente");
    },
    onSettled() {
      queryClient.invalidateQueries({
        queryKey: [API_ENDPOINTS.CLIENT_LIST],
      });
    },
  });
};
