import ProductCard from "@/components/cards/product-card";
import "./product-list.scss";

export const ProductList = ({ products, errorText = "Product not found." }) => {
  return (
    <>
      {products.length > 0 ? (
        <div className="products-list">
          {products.map((product) => (
            <ProductCard product={product} cardHeight="226px" />
          ))}
        </div>
      ) : (
        <p className="text-center py-5">
          {errorText}
        </p>
      )}
    </>
  );
};
