"use client";

import { useEffect, useState } from "react";
import Loading from "@/components/loading";
import { ProductListWithCategories } from "@/components/product-list";
import { fetchData } from "@/utils/fetch-api";
import { useParams } from "next/navigation";
import Pagination from "@/components/pagination";

const Category = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [mainCategories, setMainCategories] = useState([]);
  const [activePage, setActivePage] = useState(1);
  const [totalPages, setTotalPages] = useState(null);
  const params = useParams();

  const setPages = (page) => setActivePage(page);

  useEffect(() => {
    const fetchDataAsync = async () => {
      setIsLoading(true);
      try {
        const result = await fetchData("getCategoryPagination", false, {
          CatId: params?.id,
          Atributes: [],
          Page: activePage,
        });
        setProducts(result.Products);
        setMainCategories(result.MainCategories);
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
        <div className="category-page">
          <ProductListWithCategories
            currentCategoryId={params?.id}
            categories={mainCategories}
            products={products}
          >
            {totalPages > 1 && (
              <Pagination
                totalPages={totalPages}
                activePage={activePage}
                setPages={setPages}
              />
            )}
          </ProductListWithCategories>
        </div>
      )}
    </main>
  );
};

export default Category;
