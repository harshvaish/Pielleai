export type ServerActionResponse<T = unknown> = {
  success: boolean;
  message: null | string;
  data: T;
};
