export type CredentialsParams = {
  email: string;
  password: string;
};

export type JwtPayload = {
  email: string;
  sub: number;
};

export type Tokens = {
  refresh_token: string;
  access_token: string;
};
export type rfTokenParam = {
  userId: number;
  rt: string;
};

export type FindAllFilters = {
  isFullDay?: boolean;
  schoolId?: number;
  schoolGroupId?: number;
  period?: { start: string; end: string };
  city?: string;
  userId?: number;
  page?: number;
  perPage?: number;
  orderBy?: string;
  orderDirection?: 'asc' | 'desc';
};

export interface CreateNotificationParam {
  userId: number;
  title: string;
  message: string;
  data?: any;
}
