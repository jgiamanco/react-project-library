import { ReactNode } from "react";
import Header from "./Header";
import Footer from "./Footer";
import AuthGuard from "./AuthGuard";

interface LayoutProps {
  children: ReactNode;
  requireAuth?: boolean;
}

const Layout = ({ children, requireAuth = false }: LayoutProps) => {
  const content = requireAuth ? <AuthGuard>{children}</AuthGuard> : children;

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">{content}</main>
      <Footer />
    </div>
  );
};

export default Layout;
