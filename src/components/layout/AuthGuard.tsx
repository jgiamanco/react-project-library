
import { ReactNode, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

interface AuthGuardProps {
  children: ReactNode;
}

const AuthGuard = ({ children }: AuthGuardProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const isAuthenticated = localStorage.getItem("authenticated") === "true";

  useEffect(() => {
    if (!isAuthenticated && !location.pathname.includes("/signin") && !location.pathname.includes("/signup")) {
      navigate("/signin");
    }
  }, [isAuthenticated, navigate, location.pathname]);

  return <>{children}</>;
};

export default AuthGuard;
