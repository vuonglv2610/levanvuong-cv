import React, {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { get } from "services/api";
import { getCookie, removeCookie } from "../libs/getCookie";

// Thêm interface để định nghĩa kiểu dữ liệu cho context
interface AuthContextType {
  userInfo: any;
  setUserInfo: React.Dispatch<React.SetStateAction<any>>;
  logout: () => void;
}

// Khởi tạo context với kiểu dữ liệu đúng
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuthProvider = () => {
  const data = useContext(AuthContext);
  if (data === undefined) {
    throw new Error("useAuthProvider must be used within a AuthProvider tag");
  }
  return data;
};

interface AuthProviderInterface {
  children: ReactNode;
}

const AuthProvider = ({ children }: AuthProviderInterface) => {
  const [userInfo, setUserInfo] = useState<any>(undefined);

  const fetchProfile = async () => {
    if (getCookie("accessToken") && getCookie("userId")) {
      try {
        const res = await get(`/user/${getCookie("userId")}`);
        setUserInfo(res.data);
      } catch (error) {
        console.log(error);
      }
    } else {
      // if (
      //   window.location.pathname !== "/login" &&
      //   window.location.pathname !== "/register"
      // ) {
      //   window.location.href = "/login";
      // }
    }
  };

  // check auth in admin page
  // if (
  //   userInfo &&
  //   userInfo?.role !== "admin" &&
  //   window.location.pathname.includes("/admin")
  // ) {
  //   window.location.href = "/";
  // }

  const logout = () => {
    setUserInfo(undefined);
    removeCookie("accessToken");
    removeCookie("userId");
    window.location.href = "/login";
  };

  const authContextValue: AuthContextType = useMemo(
    () => ({
      userInfo,
      setUserInfo,
      logout,
    }),
    [userInfo]
  );

  useEffect(() => {
    fetchProfile();
  }, []);

  return (
    <AuthContext.Provider value={authContextValue}>
      {/* TODO: check permission private route by role*/}
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
