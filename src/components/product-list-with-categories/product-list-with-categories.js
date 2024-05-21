
import CategoryTabs from "./category-tabs";
import ProductList from "./product-list";
import "./product-list-with-categories.scss";

const ProductListWithCategories = ({
  categories,
  categoryId,
  products,
}) => {
  return (
    <div className="categories-products-container">
      <CategoryTabs categories={categories} categoryId={categoryId} />
      {products.length > 0 ? (
        <ProductList products={products} />
      ) : (
        <p className="text-center py-5">
          There is no product in this category.
        </p>
      )}
    </div>
  );
};

export default ProductListWithCategories;