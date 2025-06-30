import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { getProfile } from "services/api";
import { getUserRoleFromString, UserRole } from "../configs/permissions";
import { getCookie, removeCookie } from "../libs/getCookie";

// Thêm interface để định nghĩa kiểu dữ liệu cho context
interface AuthContextType {
  userInfo: any;
  setUserInfo: React.Dispatch<React.SetStateAction<any>>;
  logout: () => void;
  userRole: UserRole;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isLoading: boolean;
  refreshProfile: () => Promise<void>;
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
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchProfile = async () => {
    if (getCookie("accessToken") && getCookie("userId")) {
      try {
        setIsLoading(true);
        const res = await getProfile()
        setUserInfo(res.data);
      } catch (error) {
        console.log(error);
        setUserInfo(null);
      } finally {
        setIsLoading(false);
      }
    } else {
      setIsLoading(false);
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

  // Expose fetchProfile để có thể gọi từ bên ngoài
  const refreshProfile = fetchProfile;

  // Tính toán các giá trị derived - dựa trên cấu trúc API thực tế
  const roleKey = userInfo?.result?.data?.role?.role_key;
  const hasRoleId = !!userInfo?.result?.data?.roleId;

  // Xác định role: nếu không có roleId thì là customer
  const actualRole = hasRoleId ? roleKey : 'customer';
  const userRole = actualRole ? getUserRoleFromString(actualRole) : UserRole.PUBLIC;
  const isAuthenticated = !!userInfo && !!getCookie("accessToken");
  const isAdmin = roleKey === 'admin';

  const authContextValue: AuthContextType = useMemo(
    () => ({
      userInfo,
      setUserInfo,
      logout,
      userRole,
      isAuthenticated,
      isAdmin,
      isLoading,
      refreshProfile,
    }),
    [userInfo, userRole, isAuthenticated, isAdmin, isLoading, refreshProfile]
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


