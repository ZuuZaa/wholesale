import ProductCard from "@/components/cards/product-card";
import "./product-list.scss";

export const ProductList = ({ products, children, errorText = "Product not found."}) => {
  return (
    <div className="products-list-container">
      {products?.length > 0 ? (
        <>
          <div className="products-list">
            {products.map((product) => (
              <ProductCard product={product} cardHeight="226px" />
            ))}
          </div>
          {children}
        </>
      ) : (
        <p className="text-center py-5">{errorText}</p>
      )}
    </div>
  );
};
