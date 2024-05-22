import FavoriteIcon from "./favorite-icon";

const FavoriteImageContainer = ({ productId, isFavorite, children }) => {
  return (
    <div className="product-image-container">
      <FavoriteIcon isFavorite={isFavorite} productId={productId} isAbsolute={true}/>
      {children}
    </div>
  );
};

export default FavoriteImageContainer;
