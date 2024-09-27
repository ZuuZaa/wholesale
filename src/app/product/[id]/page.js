"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import starIcon from "@/assets/icons/star.svg";
import "./product.scss";

// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

// import required modules

import Loading from "@/components/loading";
import ProductCard from "@/components/cards/product-card";
import FavoriteIcon from "@/components/favorite-icon/favorite-icon";
import { fetchData } from "@/utils/fetch-api";
import { useTotalQuantity } from "@/context/total-quantity-context";

export default function ProductDetail() {
  const params = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [similarProducts, setSimilarProducts] = useState([]);
  const [category, setCategory] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [productDetails, setProductDetails] = useState({});
  const [count, setCount] = useState(0);
  const { setTotalQuantity } = useTotalQuantity();

  useEffect(() => {
    const fetchDataAsync = async () => {
      setIsLoading(true);
      try {
        const result = await fetchData("getProductDetails", true, {
          ProductId: params?.id,
        });
        setCategory(result.Category);
        setReviews(result.Reviews);
        if (result?.Products?.length > 0) {
          setProductDetails(result.Products[0]);
          setCount(result.Products[0].Quantity);
        }
        console.log(category)
      } catch (error) {
        console.error(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDataAsync();
  }, []);

  // let updateQuantity = async (quantity) => {
  //   try {
  //     const response = await fetchData("postCart", true, {
  //       ProductId: productDetails.ProductId,
  //       Quantity: quantity,
  //     });
  //     setCount(response?.Product?.[0]?.Quantity);
  //     setPrice(response?.Product?.[0]?.Total);
  //     updateTotalPrise(response?.Subtotal?.toFixed(2));
  //   } catch (err) {
  //     console.log(err);
  //   }
  // };

  const increaseProductQuantity = () => setCount(count + 1);

  const decreaseProductQuantity = () => {
    if (count > 1) {
      setCount(count - 1);
    }
  };

  const addToCart = async (event) => {
    event.preventDefault();
    try {
      const response = await fetchData("postCart", true, {
        ProductId: productDetails.ProductId,
        Quantity: count,
      });
      setCount(response.Product[0].Quantity);
      setTotalQuantity(response.TotalQuantity);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <main>
      {isLoading ? (
        <Loading />
      ) : (
        <div className="product-page">
          {productDetails ? (
            <>
              <ul className="breadcrumb">
                <li>
                  <Link href="/">Home &gt;</Link>
                </li>
                {category?.length > 0 && (
                  <li>
                    <Link href={`/category/${category[0]?.Id}`}>
                      {category[0]?.Name} &gt;
                    </Link>
                  </li>
                )}
                <li>{productDetails.Name}</li>
              </ul>
              <section className="product-main-info">
                <figure className="product-main-image">
                  <img
                    src={productDetails.MainImage}
                    onError={(e) =>
                      productDetails.CatImage &&
                      (e.target.src = productDetails.CatImage)
                    }
                    alt={productDetails.Name}
                  />
                </figure>
                <div className="product-details">
                  <div className="flex justify-between">
                    <h3>{productDetails.Name}</h3>
                    <FavoriteIcon
                      productId={productDetails.ProductId}
                      isFavorite={productDetails.Favorite}
                    />
                  </div>

                  <div className="product-review">
                    <span>{productDetails?.StarCount?.toFixed(1)}</span>
                    <ul className="stars">
                      {Array.from({ length: 5 }).map((item) => (
                        <li key={item}>
                          <Image
                            src={starIcon}
                            className="star-icon"
                            alt="star"
                          />
                        </li>
                      ))}
                    </ul>
                    <span>{`${reviews.length} reviews`}</span>
                  </div>
                  <p className="price">{`₤${productDetails?.Price?.toFixed(
                    2
                  )}`}</p>
                  <div className="actions">
                    <div className="card-actions">
                      <button
                        className="btn-remove"
                        onClick={decreaseProductQuantity}
                      >
                        -
                      </button>
                      <span className="count color-green">{count}</span>
                      <button
                        className="btn-add"
                        onClick={increaseProductQuantity}
                      >
                        +
                      </button>
                    </div>
                    <button
                      className="btn btn-success"
                      id={productDetails.Id}
                      onClick={addToCart}
                    >
                      Add to cart
                    </button>
                  </div>
                </div>
              </section>
              {similarProducts?.length > 0 && (
                <section className="similar-products">
                  <h3>Items You Might Like</h3>
                  <Swiper
                    slidesPerView={"auto"}
                    spaceBetween={3}
                    className="similar-products-list"
                  >
                    {similarProducts?.map((product) => (
                      <SwiperSlide
                        key={product.Id}
                        className="product-card-slide"
                      >
                        <ProductCard product={product} cardHeight="160px" />
                      </SwiperSlide>
                    ))}
                  </Swiper>
                </section>
              )}
              {reviews.length > 0 && (
                <section className="review">
                  <div className="review-title flex justify-between">
                    <h3>Reviews</h3>
                    <Link href="#">read more</Link>
                  </div>

                  <ul className="reviews-list">
                    {reviews.map((review) => (
                      <li className="review-item p-3 ">
                        <div className="flex gap-2">
                          <ul className="stars">
                            {Array.from({ length: 5 }).map((item) => (
                              <li key={item}>
                                <Image
                                  src={starIcon}
                                  className="star-icon"
                                  alt="star"
                                />
                              </li>
                            ))}
                          </ul>
                          <p className="reviewer">**** *****</p>
                        </div>
                        <p className="review-text">{review.text}</p>
                      </li>
                    ))}
                  </ul>
                </section>
              )}
              {/* <section className="product-properties">
                <ul className="product-property-list">
                  {categories.map((item) => (
                    <li className="product-property-item" key={item.id}>
                      <span className="dot"></span>
                      {item.text}
                    </li>
                  ))}
                </ul>
              </section> */}
            </>
          ) : (
            <p className="text-center py-5">Product is not available.</p>
          )}
        </div>
      )}
    </main>
  );
}
