import { ReactNode } from "react";
import AppRoutes from "../common/AppRoutes"
interface Params {
  href: string;
  children: ReactNode;
  toggleNavBar: () => any;
}
export default function CustomNavLink({
  href,
  children,
  toggleNavBar,
  ...rest
}: Params & React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <div
      className={window.location.pathname == href ? "active-nav-link" : "inactive-nav-link"}
    >
      <div onClick={() => AppRoutes.navigate(href)} {...rest}>
        <div className="w-full cursor-pointer" onClick={toggleNavBar}>
          {children}
        </div>
      </div>
    </div>
  );
}
