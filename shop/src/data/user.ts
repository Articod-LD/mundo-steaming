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
  Categorie,
  ISolicitudPaginator,
  Plataforma,
  PlataformasPaginator,
  QueryOptionsType,
  User,
  UserPaginator,
} from "@/types";
import { mapPaginatorData } from "@/utils/date-mapper";
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

export const useRegisterMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: userClient.register,
    onSuccess() {
      toast.success("Registrado Correctamente");
    },
    onSettled() {
      queryClient.invalidateQueries([API_ENDPOINTS.PROVIDERS_LIST]);
      queryClient.invalidateQueries([API_ENDPOINTS.CLIENT_LIST]);
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
    [API_ENDPOINTS.CLIENT_LIST, params],
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
        queryKey: [API_ENDPOINTS.PLATAFORMA_REGISTER],
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
        queryKey: [API_ENDPOINTS.BANNER_REGISTER],
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
    onSuccess() {
      toast.success("La suscripcion ha sido aceptada correctamente", {
        duration: 5000,
      });
    },
    onSettled() {
      queryClient.invalidateQueries({
        queryKey: [API_ENDPOINTS.CLIENT_LIST],
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
