import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";

function useRouter() {
  const [isReady, setReady] = useState(false);
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();
  const [query, changeQuery] = useState<Partial<Record<string, string>>>({});

  useEffect(() => {
    const queryRaw = searchParams
      .toString()
      .split("&")
      .filter((item) => item !== "&")
      .map((item) => {
        const [key, value] = item.split("=");
        return {
          [key]: decodeURIComponent(value),
        };
      });
    let queryFormat = {};
    queryRaw.forEach((item) => {
      queryFormat = { ...queryFormat, ...item };
    });
    changeQuery(queryFormat);
    setReady(true);
  }, [searchParams]);

  const router = useMemo(
    () => ({
      navigate,
      query,
      setSearchParams,
      isReady,
      ...location,
    }),
    [navigate, query, setSearchParams, isReady, location]
  );

  return router;
}

export default useRouter;
