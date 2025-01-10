import { NextPage } from "next";
import { ReactElement, ReactNode } from "react";

export interface UserPaginator extends PaginatorInfo<User> {}
export interface ProductPaginator extends PaginatorInfo<Product> {}
export interface PlataformasPaginator extends PaginatorInfo<Plataforma> {}
export interface ISolicitudPaginator extends PaginatorInfo<ISolicitud> {}

export type NextPageWithLayout<P = {}> = NextPage<P> & {
  authorization?: boolean;
  getLayout?: (page: ReactElement) => ReactNode;
};

export interface Settings {
  id: string;
  options: {
    siteTitle: string;
    siteSubtitle: string;
    currency: string;
    logo: Attachment;
    seo: SEO;
    contactDetails: ContactDetails;
    useOtp: Boolean;
    [key: string]: string | any;
  };
}

export interface Attachment {
  id: string;
  original: string;
  thumbnail: string;
  __typename?: string;
}

export interface SEO {
  metaTitle: string;
  metaDescription: string;
  ogTitle: string;
  ogDescription: string;
  ogImage: Attachment;
  twitterHandle: string;
  twitterCardType: string;
  metaTags: string;
  canonicalUrl: string;
}

export interface ContactDetails {
  socials: [ShopSocials];
  contact: string;
  location: Location;
  website: string;
}

export interface ShopSocials {
  icon: string;
  url: string;
}

export interface Location {
  lat: number;
  lng: number;
  city: string;
  state: string;
  country: string;
  zip: string;
  formattedAddress: string;
}

export interface User {
  id: number;
  name: string;
  role: string;
  permissions: any[];
  suscriptions: Suscriptions[];
  email: string;
  phone: string;
  created_at: string;
  updated_at: string;
  wallet: string;
  is_active: number;
}
export interface Suscriptions {
  productos: Product[];
  start_date: string;
  end_date: string;
  id: number;
  price: string;
}

export interface SuscriptionSuccess {
  usuario: SuscriptionUser;
  plataformas: SuscriptionPlataforma[];
}

export interface SuscriptionUser {
  id: number;
  name: string;
  email: string;
  phone: null | string;
}

export interface SuscriptionPlataforma {
  id: number;
  name: string;
  image_url: string;
  cantidad: number;
  type: string;
}

export interface Product {
  id: number;
  screen_count: number;
  profile_name?: string;
  profile_pin?: string;
  purchase_date: string;
  months: number;
  plataforma: Plataforma;
  credencial: Credencial;
  created_at: string;
  updated_at: string;
  status: string;
}

export interface Credencial {
  id: number;
  email: string;
  password: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface ChangePasswordInput {
  currentpassword: string;
  newpassword: string;
  repeatpassword: string;
}

export interface MappedPaginatorInfo {
  currentPage: number;
  firstPageUrl: string;
  from: number;
  lastPage: number;
  lastPageUrl: string;
  links: any[];
  nextPageUrl: string | null;
  path: string;
  perPage: number;
  prevPageUrl: string | null;
  to: number;
  total: number;
  hasMorePages: boolean;
}

export interface AuthResponse {
  token: string;
  permissions: string[];
}

export enum Permission {
  super_admin = "super_admin",
  Customer = "customer",
  provider = "provider",
}
export interface RegisterInput {
  email: string;
  password: string;
  name: string;
  permission: Permission;
  phone?: string | null | undefined;
}

export interface RegisterProductInput {
  plataforma_id: number;
  email: string;
  password: string;
  perfil?: string | null | undefined;
  pin_perfil?: string | null | undefined;
  fecha_compra: Date;
  meses: number;
}

export type RegisterInputType = {
  name: string;
  email: string;
  password: string | null | undefined;
  permission: any;
  phone?: string | null | undefined;
};

export type UpdateProfileInputType = {
  name: string;
  documento: string;
  telefono: string;
  direccion: string;
  email?: string;
};

export enum SortOrder {
  Asc = "asc",
  Desc = "desc",
}

export interface QueryOptions {
  language: string;
  limit?: number;
  page?: number;
  orderBy?: string;
  sortedBy?: SortOrder;
}

export type QueryOptionsType = {
  page?: number;
  name?: string;
  limit?: number;
  orderBy?: string;
  sortedBy?: SortOrder;
};

export interface PaginatorInfo<T> {
  current_page: number;
  data: T[];
  first_page_url: string;
  from: number;
  last_page: number;
  last_page_url: string;
  links: any[];
  next_page_url: string | null;
  path: string;
  per_page: number;
  prev_page_url: string | null;
  to: number;
  total: number;
}

export interface UserQueryOptions extends QueryOptions {
  name: string;
  search?: string;
  is_active?: boolean;
}

export interface Plataforma {
  id: number;
  name: string;
  image_url: string;
  provider_price: string;
  public_price: string;
  count_avaliable: number;
  productos: unknown[];
  type: string;
  categoria: Categorie;
  cantidad?: number;
  description: string;
}

export interface Recharge {
  user: User;
  amount: string;
  payment_status: string;
  payment_method: string;
  payment_reference: string;
  created_at: string;
}

export interface Categorie {
  id: number;
  titulo: string;
  imagen: string;
  imagen_url: string;
}

export interface Banner {
  id: number;
  titulo: string;
  imagen: string;
  imagen_url: string;
  texto: string;
  logo: string;
}

export interface PlataformaInput {
  name: string;
  image_url: string;
  public_price: string;
  provider_price: string;
  type: unknown;
  categoria_id: unknown;
  description: string;
}

export interface BannerInput {
  titulo: string;
  texto: string;
  imagen: string;
}

export interface CategorieInput {
  titulo: string;
  imagen: string;
}

export interface CreateProductoForm {
  plataforma: {
    id: number;
    name: string;
    type: string;
  };
  correo: string;
  contrasena: string;
  perfil?: string | null | undefined;
  pin_perfil?: string | null | undefined;
  fecha_compra: Date;
  meses: number;
}

export interface ISolicitud {
  id: string;
  usuario_id: number;
  tipo_id: number;
  created_at: Date;
  user: User;
  tipo: Plataforma;
}
export interface SolicitudInput {
  usuario_id: string;
  tipo_id: string;
}

export interface AceptarSolicitudInput {
  fecha_inicio: Date;
  fecha_fin: Date;
  precio: string;
  pagado?: boolean;
  email: string;
  password: string;
  plataforma?: any;
}

export interface CrearSuscripcionInput {
  user_id: number;
  plataformas: {
    id: number;
    cantidad: number;
  }[];
}

export interface walletInput {
  userId: string;
  amount: number;
  operation: string;
}
