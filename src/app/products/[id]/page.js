"use client";
import { React, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import "./products.scss";
import { ProductList } from "@/components/product-list";
import Loading from "@/components/loading";
import { fetchData } from "@/utils/fetch-api";
import Pagination from "@/components/pagination";

export default function Products() {
  const [isLoading, setIsLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const params = useParams();
  const [activePage, setActivePage] = useState(1);
  const [totalPages, setTotalPages] = useState(null);

  const setPages = (page) => setActivePage(page);

  useEffect(() => {
    const fetchDataAsync = async () => {
      setIsLoading(true);
      try {
        const result = await fetchData("getProductsPagination", false, {
          TypeId: params?.id,
          Atributes: [],
          Page: activePage,
        });
        console.log("result: ", result);
        setProducts(result.Products);
        setTotalPages(result.PageCount);
      } catch (error) {
        console.error(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDataAsync();
  }, [activePage]);

  return (
    <main>
      {isLoading ? (
        <Loading />
      ) : (
        <div className="products-page">
          <ProductList products={products}>
          {totalPages > 1 && (
            <Pagination
              totalPages={totalPages}
              activePage={activePage}
              setPages={setPages}
            />
          )}
          </ProductList>
        </div>
      )}
    </main>
  );
}
