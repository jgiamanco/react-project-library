
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
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">{content}</main>
      <Footer />
    </div>
  );
};

export default Layout;
