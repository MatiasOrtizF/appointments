import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react"

import { User } from "@supabase/supabase-js"
import { supabase } from "../../config/Supabase"

type Role = "admin" | "user"

type AuthContextType = {
  loading: boolean
  isAuthenticated: boolean
  role: Role
  isAdmin: boolean
  user: User | null
}

const AuthContext = createContext<AuthContextType>({
  loading: true,
  isAuthenticated: false,
  role: "user",
  isAdmin: false,
  user: null
})

export function AuthProvider({
  children
}: {
  children: ReactNode
}) {

  const [loading, setLoading] = useState(true)

  const [user, setUser] =
    useState<User | null>(null)

  const [role, setRole] =
    useState<Role>("user")

  useEffect(() => {

    // sesión inicial
    supabase.auth.getUser()
      .then(async ({ data }) => {

        const currentUser = data.user

        setUser(currentUser)

        if (!currentUser) {
          setRole("user")
          setLoading(false)
          return
        }

        await loadRole(currentUser.id)

        setLoading(false)
      })

    // listener auth
    const {
      data: listener
    } = supabase.auth.onAuthStateChange(
      async (_, session) => {
    console.log("AUTH EVENT", _);
        const currentUser =
          session?.user ?? null

          console.log("AUTH USER", currentUser?.id);

        setUser(currentUser)

        if (!currentUser) {
          setRole("user")
          setLoading(false)
          return
        }

        await loadRole(currentUser.id)

        setLoading(false)
      }
    )

    return () => {
      listener.subscription.unsubscribe()
    }

  }, [])

  const loadRole = async (userId: string) => {

    const { data, error } = await supabase
      .from("usuarios")
      .select("role")
      .eq("id", userId)
      .single()

    if (error || !data) {
      setRole("user")
      return
    }

    setRole(
      data.role === "admin"
        ? "admin"
        : "user"
    )
  }

  return (
    <AuthContext.Provider
      value={{
        loading,
        isAuthenticated: !!user,
        role,
        isAdmin: role === "admin",
        user
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}