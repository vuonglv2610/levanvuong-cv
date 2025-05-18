import { useQuery } from "@tanstack/react-query";
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { get } from "services/api";

interface TableManageProps {
  isShowFooter: boolean;
  url: string;
}

const TableManage = ({ isShowFooter = true, url }: TableManageProps) => {
  const { data } = useQuery({ queryKey: [url], queryFn: () => get(url) });
  let dataProducts = data?.data?.result?.data;

  const navigate = useNavigate()

  if (data?.data) {
    toast.success("get success!");
  }

  // const mutation = useMutation({
  //   mutationFn: () => post(url, {}),
  //   onSuccess: () => {
  //     // Invalidate and refetch
  //     queryClient.invalidateQueries({ queryKey: ['todos'] })
  //   },
  // })

  // const addProduct = () => {
  //   return post(url, {
  //     albumId: 1,
  //     title: "nihil at amet non hic quia qui",
  //     url: "https://via.placeholder.com/600/1ee8a4",
  //     thumbnailUrl: "https://via.placeholder.com/150/1ee8a4",
  //   });
  // };

  // const useAddProduct =  () => {
  //   return  useMutation(addProduct);
  // };

  // const [page, setPage] = useState(1);
  //   todo: feature filter
  // const [select, setSelect] = useState<any>("ALL");
  // const [input, setInput] = useState<any>("");
  // const [limit, setLimit] = useState<any>(10);
  // const [totalPage, setTotalPage] = useState<any>(1);
  // const [flag, setFlag] = useState(false);
  // const { data, totals, fetchData } = useGetQuery(
  //   `${url}?_page=${page}&_limit=${limit}`
  // );

  // const numbers = Array.from({ length: totalPage }, (_, index) => index);

  // useEffect(() => {
  //   setTotalPage((totals / 10).toFixed());
  // }, [totals]);

  // useEffect(() => {
  //   if (flag) {
  //     fetchData();
  //   }
  //   setFlag(true);
  // }, [page, limit]);

  return (
    <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
      <div className="flex mb-6 gap-20 justify-end">
        <select
          id="small"
          // onChange={(e) => setSelect(e.target.value)}
          className="w-[320px] block p-2 text-sm text-gray-900 border rounded-lg bg-gray-50"
        >
          <option value="ALL">ALL</option>
          <option value="US">United States</option>
          <option value="CA">Canada</option>
          <option value="FR">France</option>
          <option value="DE">Germany</option>
        </select>
        <input
          type="text"
          id="simple-search"
          className="w-[320px] border border-gray-300 text-gray-900 text-sm rounded-lg bg-gray-50"
          placeholder="Search branch name..."
        // onChange={(e) => setInput(e.target.value)}
        />
      </div>
      <div className="text-end">
        {/* <Link to="#" className="bg-blue-600 px-3 py-2 rounded text-white"> */}
        <button
          className="bg-blue-600 px-3 py-2 rounded text-white"
          onClick={() => navigate('/admin/product/add')}
        >
          Add news
        </button>
        {/* </Link> */}
      </div>
      <table className="w-full text-sm text-left rtl:text-right text-gray-400">
        <thead className="text-xs uppercase text-gray-400">
          <tr>
            <th scope="col" className="px-6 py-3">
              STT
            </th>
            <th scope="col" className="px-6 py-3">
              Product name
            </th>
            <th scope="col" className="px-6 py-3">
              Img
            </th>
            <th scope="col" className="px-6 py-3">
              Price
            </th>
            <th scope="col" className="px-6 py-3">
              <span className="sr-only">Edit</span>
            </th>
          </tr>
        </thead>
        {/* todo: show fields follow page  */}
        <tbody>
          {dataProducts &&
            dataProducts.map((item: any, i: number) => (
              <tr
                className="bg-white border-b bg-gray-800 border-gray-700 hover:bg-gray-50 hover:bg-gray-600"
                key={`${item.name}${i}`}
              >
                <th
                  scope="row"
                  className="px-6 py-4 font-medium whitespace-nowrap text-white"
                >
                  {i + 1}
                </th>
                <th
                  scope="row"
                  className="px-6 py-4 font-medium whitespace-nowrap text-white"
                >
                  {item?.name}
                </th>
                <td className="px-6 py-4">
                  <img
                    src={item?.img}
                    alt="#"
                    width={50}
                    height={50}
                  />
                </td>
                <td className="px-6 py-4">{item?.price}</td>
                <td className="px-6 py-4 text-right">
                  <Link
                    to={`edit/${item.id}`}
                    className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                  >
                    Edit
                  </Link>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
      {/* {isShowFooter && (
        <div className="flex justify-between">
          <select
            id="small"
            onChange={(e) => {
              setLimit(e.target.value);
              if (e.target.value >= totals) {
                setTotalPage(1);
                setPage(1);
              } else {
                setTotalPage((totals / 10).toFixed());
              }
            }}
            className="w-[75px] m-2 block p-2 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          >
            <option value="10">10</option>
            <option value="15">15</option>
            <option value="20">20</option>
            <option value="50">50</option>
            <option value="100">100</option>
          </select>
          <nav
            aria-label="Page navigation example"
            className="flex justify-end m-[10px]"
          >
            <ul className="flex items-center -space-x-px h-8 text-sm">
              <li>
                <Link
                  to="#"
                  onClick={() => page > 1 && setPage(page - 1)}
                  className="flex items-center justify-center px-3 h-8 ms-0 leading-tight text-gray-500 bg-white border border-e-0 border-gray-300 rounded-s-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                >
                  <span className="sr-only">Previous</span>
                  <svg
                    className="w-2.5 h-2.5 rtl:rotate-180"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 6 10"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 1 1 5l4 4"
                    />
                  </svg>
                </Link>
              </li>
              {numbers.map((i: any) => (
                <li key={i}>
                  <Link
                    onClick={() => setPage(i + 1)}
                    to="#"
                    aria-current="page"
                    className={`flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white ${
                      page === i + 1
                        ? "[&]:text-blue-600 bg-blue-50 font-bold"
                        : ""
                    }`}
                  >
                    {i + 1}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  onClick={() => page < totalPage && setPage(page + 1)}
                  to="#"
                  className="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 rounded-e-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                >
                  <span className="sr-only">Next</span>
                  <svg
                    className="w-2.5 h-2.5 rtl:rotate-180"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 6 10"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="m1 9 4-4-4-4"
                    />
                  </svg>
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      )} */}
    </div>
  );
};

export default TableManage;
