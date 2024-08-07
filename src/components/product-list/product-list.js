import ProductCard from "@/components/cards/product-card";
import "./product-list.scss";

export const ProductList = ({
  products,
  children,
  errorText = "Product not found.",
}) => {
  
  return (
    <div className="products-list-container">
      {products?.length > 0 ? (
        <>
          <ul className="products-list">
            {products.map((product) => (
              <li key={product.Id}>
                <ProductCard product={product} cardHeight="226px" />
              </li>
            ))}
          </ul>
          {children}
        </>
      ) : (
        <p className="text-center py-5">{errorText}</p>
      )}
    </div>
  );
};
