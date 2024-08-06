"use client";
import { React, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import "./products.scss";
import { ProductList } from "@/components/product-list";
import Loading from "@/components/loading";
import { fetchData } from "@/utils/fetch-api";

export default function Products() {
  const [isLoading, setIsLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const params = useParams();

  useEffect(() => {
    const fetchDataAsync = async () => {
      setIsLoading(true);
      try {
        const result = await fetchData("getProductsPage", true, {
          TypeId: params?.id,
          Atributes: [],
          Count: 24,
        });
        console.log("result: ", result)
        setProducts(result.Products);
      } catch (error) {
        console.error(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDataAsync();
  }, []);

  return (
    <main>
      {isLoading ? (
        <Loading />
      ) : (
        <div className="products-page">
          <ProductList products={products} />
        </div>
      )}
    </main>
  );
}
