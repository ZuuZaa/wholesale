"use client";
import { useEffect, useState } from "react";
import Loading from "@/components/loading";
import { ProductListWithCategories } from "@/components/product-list";
import { fetchData } from "@/utils/fetch-api";
import { useParams } from "next/navigation";

const Category = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [mainCategories, setMainCategories] = useState([]);
  const params = useParams();

  useEffect(() => {
    const fetchDataAsync = async () => {
      setIsLoading(true);
      try {
        const result = await fetchData("getCategoryPage", true, {
          CatId: params?.id,
          Atributes: [],
          Page: 1,
        });
        setProducts(result.Products);
        setMainCategories(result.MainCategories);
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
        <div className="category-page">
          <ProductListWithCategories
            currentCategoryId={params?.id}
            categories={mainCategories}
            products={products}
          />
        </div>
      )}
    </main>
  );
};

export default Category;
