"use client";

import axios from "node_modules/axios";
import { useRouter } from "node_modules/next/navigation";
import { Table } from "node_modules/react-bootstrap/esm";
import { useEffect, useState } from "react";

// import node module libraries

const Home = () => {
  const [notification, setNotification] = useState({
    status: false,
    message: "",
  });
  const router = useRouter();
  let accessToken = "";
  const [products, setProducts] = useState(null);

  const getProducts = async (accessToken) => {
    try {
      await axios
        .get("/api/products", {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        })
        .then((response) => {
          setProducts(response.data);
        })
        .catch((error) => {
          console.log(error);
          if (error?.response?.data?.statusCode === 401) {
            setNotification({
              status: true,
              message: "Gagal",
            });
          }
        });
    } catch (error) {
      if (err.response?.status === 403) {
        const refreshToken = localStorage.getItem("refreshToken");
        const res = await axios.post(process.env.NEXT_PUBLIC_REFRESh_TOKEN, {
          refreshToken,
        });
        localStorage.setItem("accessToken", res.data.accessToken);
        return getProfile();
      } else {
        console.error("Gagal akses:", err.message);
      }
    }
  };

  useEffect(() => {
    accessToken = localStorage.getItem("accessToken");

    if (!accessToken) {
      router.push("/authentication/sign-in");
      return;
    }

    getProducts(accessToken);
  }, []);

  return (
    <div className="container mt-4">
      <Table className="text-nowrap">
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">Product Name</th>
            <th scope="col">Product Brand</th>
            <th scope="col">Product Owner</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(products) && products.length > 0 ? (
            products.map((res) => (
              <tr key={res.id}>
                <td>{res.id}</td>
                <td>{res.product_name}</td>
                <td>{res.product_brand}</td>
                <td>{res.owner_name}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" className="text-center">
                Tidak ada data produk.
              </td>
            </tr>
          )}
        </tbody>
      </Table>
    </div>
  );
};
export default Home;
