import CategoryTabs from "./category-tabs";
import { ProductList } from "./product-list";
import "./product-list-with-categories.scss";

const ProductListWithCategories = ({ products, categories, categoryId }) => {
  return (
    <div className="categories-products-container">
      {categories.length > 0 && (
        <CategoryTabs categories={categories} categoryId={categoryId} />
      )}
      <ProductList products={products} />
    </div>
  );
};

export default ProductListWithCategories;
