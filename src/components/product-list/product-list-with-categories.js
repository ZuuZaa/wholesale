import { CategoryTabs } from "@/components/tabs";
import "./product-list-with-categories.scss";

export const ProductListWithCategories = ({ products, categories, categoryId }) => {
  return (
    <div className="categories-products-container">
      {categories.length > 0 && (
        <CategoryTabs categories={categories} categoryId={categoryId} />
      )}
      <ProductList products={products} />
    </div>
  );
};
