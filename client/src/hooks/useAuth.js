import { useContext } from "react";
import { AuthContext } from "@/contexts/AuthContext";

export const useAuth = () => {
  const { user, login, logout } = useContext(AuthContext);
  return { user, login, logout };
};

export default useAuth;
