import ProductCard from "@/components/cards/product-card";
import CategoryTabs from "./category-tabs";
import "./product-list-with-categories.scss";

const ProductListWithCategories = ({ categories, categoryId, products }) => {
  return (
    <div className="categories-products-container">
      <CategoryTabs categories={categories} categoryId={categoryId} />
      {products.length > 0 ? (
        <div className="products-list">
          {products.map((product) => (
            <ProductCard product={product} cardHeight="226px" />
          ))}
        </div>
      ) : (
        <p className="text-center py-5">
          There is no product in this category.
        </p>
      )}
    </div>
  );
};

export default ProductListWithCategories;
