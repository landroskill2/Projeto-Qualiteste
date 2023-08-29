import { Outlet, useNavigate } from "react-router-dom";
import { FaUser, FaUsers } from "react-icons/fa";

export default function Admin() : React.ReactElement {
    const navigate = useNavigate()
    const Option = ({
        title,
        onClick,
        icon,
      }: {
        title: string;
        onClick: () => any;
        icon: JSX.Element;
      }) => (
        <div
          className="flex flex-col flex-1 bg-gradient-to-br from-slate-500 
                       to-slate-900 text-white text-2xl text-center rounded-xl
                        cursor-pointer select-none hover:scale-105 transition-all p-20"
          onClick={onClick}
        >
          <div className="flex justify-center mb-3 dark:[&>*]:!text-white">
            {icon}
          </div>
          {title}
        </div>
      );
      return (
        <div className="flex gap-3 flex-col sm:flex-row px-5 overflow-auto">
          <div className="flex flex-row flex-1 flex-wrap gap-10 sm:gap-20 justify-between p-3 sm:mb-0">
            <Option
              title={"Criar conta"}
              onClick={() => navigate("/admin/register-account") } //mudar href
              icon={<FaUser />}
            />
            <Outlet />
          </div>
          <div className="flex flex-row flex-1 flex-wrap gap-10 sm:gap-20 justify-between p-3 sm:mb-0">
            <Option
              title={"Contas existentes"}
              onClick={() => navigate("/admin/accounts") } //mudar href
              icon={<FaUsers />}
            />
            <Outlet />
          </div>
        </div>
      );
}
