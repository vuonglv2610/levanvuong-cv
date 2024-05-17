import navbarConfig from "configs/navbarConfig";
import { useAuthProvider } from "contexts/AuthContext";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";

const Navbar = () => {
  const [navbar, setNavbar] = useState<any>();
  const history = useLocation();
  const { userInfo } = useAuthProvider();
  const user: any = userInfo;

  useEffect(() => {
    let checkNavbar = navbarConfig;
    //check is login
    if (user) {
      checkNavbar = checkNavbar.filter(
        (item) => item.href !== "/login" && item.href !== "/register"
      );
      setNavbar(checkNavbar);
    }
    //xóa bỏ các phần tử có path là admin
    if (user && user?.role !== "admin") {
      checkNavbar = checkNavbar.filter((item) => !item.href.includes("/admin"));
    }

    setNavbar(checkNavbar);
  }, [user]);

  return (
    <div className="w-[300px] h-screen flex items-center flex-col p-[40px] bg-menu fixed">
      <div className="flex flex-col h-[85vh] gap-[120px]">
        <div className="text-[2.5rem]">
          <Link to="#">
            LOGO<span>.</span>
          </Link>
        </div>
        <ul>
          {navbar &&
            navbar.map((item :any) => {
              return (
                <li
                  key={item.title}
                  className={`${
                    item.href === history.pathname && "active-menu"
                  } pb-2 mb-2 text-[16px] font-bold text-black`}
                >
                  <Link
                    className={`${
                      item.href === history.pathname && "[&]:opacity-[100%]"
                    } menu-hover inline-block w-fit opacity-[40%] h-[26px]`}
                    to={item.href}
                  >
                    {item.title}
                  </Link>
                </li>
              );
            })}
        </ul>
      </div>
      <div className="flex-1">Footer</div>
    </div>
  );
};

export default Navbar;
