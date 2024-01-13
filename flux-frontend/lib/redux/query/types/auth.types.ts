export type AuthResponse = {
  access_token: string;
  refresh_token: string;
};

export type AuthRequest = {
  email: string;
  password: string;
  path: "sign-in" | "sign-up";
};
