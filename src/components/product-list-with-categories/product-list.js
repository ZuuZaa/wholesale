import Link from 'next/link';
import Image from "next/image";
import favorite from "@/assets/icons/favorite.svg";


const ProductList = ({products}) => {
  return (
    <div className="products-list">
      {products.map((product) => (
        <div className="product-card">
          <Link
            href={`/product/${product.id}`}
            key={product.id}
            passHref={true}
          >
            <div>
              <figure className="product-image">
                <img
                  src={product.mainImage}
                  alt={product.name}
                  className="product-card-image"
                />
                <Image src={favorite} className="favorite-icon" alt="star" />
              </figure>
              <div className="product-info">
                <p>{product.name}</p>
                <span>{`₤ ${product.price}`}</span>
              </div>
            </div>
          </Link>
        </div>
      ))}
    </div>
  );
}

export default ProductList