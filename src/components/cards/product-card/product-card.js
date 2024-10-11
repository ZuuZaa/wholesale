import Link from "next/link";
import { StyledProductCard } from "./product-card.styled";
import FavoriteImageContainer from "@/components/favorite-icon/favorite-image-container";
import { useTotalQuantity } from "@/context/total-quantity-context";
import { fetchData } from "@/utils/fetch-api";

const ProductCard = ({ product, cardHeight }) => {
  const { setTotalQuantity } = useTotalQuantity();

  const addToCart = async (event) => {
    event.preventDefault();
    try {
      const response = await fetchData("postCart", true, {
        ProductId: product.ProductId,
        Quantity: 1,
      });
      setTotalQuantity(response.TotalQuantity);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Link href={`/product/${product.Id}`} key={product.Id} passHref={true}>
      <StyledProductCard height={cardHeight}>
        <FavoriteImageContainer
          productId={product.ProductId}
          isFavorite={!!product.Favorite}
          absolutePosition={true}
        >
          <figure className="product-image">
            <img
              src={product.MainImage}
              alt={product.Name}
              className="product-card-image"
            />
          </figure>
        </FavoriteImageContainer>

        <div className="product-info">
          <p>{product.Name}</p>
          <div className="flex justify-between items-center gap-3 mt-1">
            {!!product.PriceVisible && <span>{`₤${product.Price}`}</span>}
            <div className="card-action">
              <button className="btn-success" onClick={addToCart}>
                Add
              </button>
            </div>
          </div>
        </div>
      </StyledProductCard>
    </Link>
  );
};

export default ProductCard;
