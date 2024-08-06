import { CategoryTabs } from "@/components/tabs";
import "./product-list-with-categories.scss";
import { ProductList } from "./product-list";

export const ProductListWithCategories = ({
  products,
  categories,
  currentCategoryId,
  children,
}) => {
  return (
    <div className="categories-products-container">
      {categories?.length > 0 && (
        <CategoryTabs
          categories={categories}
          currentCategoryId={currentCategoryId}
        />
      )}
      <ProductList
        products={products}
        errorText="There is no product in this category."
      />
      {children}
    </div>
  );
};
