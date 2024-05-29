import Logo from "@/assets/images/Logo.svg";
import Logo2 from "@/assets/images/Logo2.png";
import routes from "@/config/routes";

export const siteSettings: any = {
  lightLogo: Logo,
  darkLogo: Logo2,
  width: 128,
  height: 40,
  avatar: {
    placeholder: "/avatar-placeholder.svg",
  },
  sidebarLinks: {
    super_admin: {
      root: {
        href: routes.dashboard,
        label: "Inicio",
        icon: "DashboardIcon",
        childMenu: [
          {
            href: routes.dashboard,
            label: "Dashboard",
            icon: "DashboardIcon",
            permissions: ["super_admin"],
          },
        ],
      },
      management: {
        href: routes.dashboard,
        label: "Monitoreo",
        icon: "DashboardIcon",
        childMenu: [
          {
            href: routes.clientes,
            label: "Clientes",
            icon: "UsersIcon",
            permissions: ["super_admin"],
          },
          {
            href: routes.providers,
            label: "Proveedores",
            icon: "UsersIcon",
            permissions: ["super_admin"],
          },
          {
            href: routes.plataformas,
            label: "Plataformas",
            icon: "ProductsIcon",
            permissions: ["super_admin"],
          },
          {
            href: routes.solicitudesPlataformas,
            label: "Solicitud Plataformas",
            icon: "ProductsIcon",
            permissions: ["super_admin"],
          },
          {
            href: routes.preguntas,
            label: "Preguntas",
            icon: "ProductsIcon",
            permissions: ["super_admin"],
          },
        ],
      },
      configuracion: {
        href: routes.dashboard,
        label: "Configuracion",
        icon: "DashboardIcon",
        childMenu: [
          {
            href: routes.logout,
            label: "Cerrar Sesion",
            icon: "UsersIcon",
            permissions: ["super_admin"],
          },
        ],
      },
    },
    customer: {
      root: {
        href: routes.plataformasClientes,
        label: "Inicio",
        icon: "DashboardIcon",
        childMenu: [
          {
            href: routes.plataformasClientes,
            label: "Plataformas",
            icon: "ProductsIcon",
            permissions: ["customer", "super_admin"],
          },
        ],
      },
      configuracion: {
        href: routes.dashboard,
        label: "Configuracion",
        icon: "DashboardIcon",
        childMenu: [
          {
            href: routes.logout,
            label: "Cerrar Sesion",
            icon: "UsersIcon",
            permissions: ["customer"],
          },
        ],
      },
    },
    provider: {
      root: {
        href: routes.plataformasClientes,
        label: "Inicio",
        icon: "DashboardIcon",
        childMenu: [
          {
            href: routes.plataformasClientes,
            label: "Plataformas",
            icon: "ProductsIcon",
            permissions: ["provider", "super_admin"],
          },
        ],
      },
      configuracion: {
        href: routes.dashboard,
        label: "Configuracion",
        icon: "DashboardIcon",
        childMenu: [
          {
            href: routes.logout,
            label: "Cerrar Sesion",
            icon: "UsersIcon",
            permissions: ["provider"],
          },
        ],
      },
    },
  },
};
