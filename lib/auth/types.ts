import type { User } from "@/types/db"

export interface AuthTokens {
  accessToken: string
  refreshToken: string
}

export interface AuthResponse {
  accessToken: string
  refreshToken: string
  user: User
}

export interface LoginInput {
  email: string
  password: string
}

export interface RegisterInput {
  fullName: string
  email: string
  password: string
  role?: "STUDENT" | "INSTRUCTOR"
}

export interface GoogleAuthInput {
  idToken: string
  role?: "STUDENT" | "INSTRUCTOR"
}

export interface AuthState {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
}

export interface GoogleSignInOptions {
  role?: "STUDENT" | "INSTRUCTOR"
  onSuccess?: (user: User) => void
  onError?: (err: unknown) => void
}

export interface AuthContextValue extends AuthState {
  login: (input: LoginInput) => Promise<User>
  register: (input: RegisterInput) => Promise<User>
  logout: () => Promise<void>
  googleSignIn: (opts?: GoogleSignInOptions) => void
}
