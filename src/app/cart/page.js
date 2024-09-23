"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Loading from "@/components/loading";
import BasketCard from "@/components/cards/basket-card";
import MobilePageLayout from "@/components/layout/mobile-page-layout";
import SearchBar from "@/components/search-bar";
import "./cart.scss";
import { fetchData } from "@/utils/fetch-api";

const Cart = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [totalPrice, setTotalPrice] = useState(0);
  const [carts, setCarts] = useState([]);
  const [filteredCarts, setFilteredCarts] = useState([]);
  const [searchKey, setSearchKey] = useState("");

  const updateTotalPrise = (price) => setTotalPrice(price);

  const updateCarts = (carts) => setCarts(carts);

  const handleInputChange = (event) =>
    setSearchKey(event.target.value.toLowerCase());

  useEffect(() => {
    const fetchDataAsync = async () => {
      setIsLoading(true);
      try {
        const result = await fetchData("getCart", true);
        console.log(result)
        setTotalPrice(result.Subtotal.toFixed(2));
        setCarts(result.Cart);
      } catch (error) {
        console.error(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDataAsync();
  }, []);

  useEffect(() => {
    const filteredCarts = carts?.filter((item) =>
      item.ProductName.toLowerCase().includes(searchKey.trim())
    );
    setFilteredCarts(filteredCarts);
  }, [searchKey]);

  return (
    <main>
      {isLoading ? (
        <Loading />
      ) : (
        <div className="cart-page">
          <MobilePageLayout title="My Basket">
            {carts.length > 0 ? (
              <>
                <SearchBar
                  searchKey={searchKey}
                  handleInputChange={handleInputChange}
                />

                <ul className="basket-list">
                  {searchKey
                    ? filteredCarts.map((item) => (
                        <BasketCard
                          product={item}
                          updateCarts={updateCarts}
                          updateTotalPrise={updateTotalPrise}
                        />
                      ))
                    : carts.map((item) => (
                        <BasketCard
                          product={item}
                          updateCarts={updateCarts}
                          updateTotalPrise={updateTotalPrise}
                        />
                      ))}
                </ul>
              </>
            ) : (
              <p className="text-center py-5">Your basket is empty.</p>
            )}
            <section className="basket-footer total-bottom">
              <div className="price-details">
                <div className="flex justify-between">
                  <span>Cart total</span>
                  <span>{`₤${totalPrice}`}</span>
                </div>
                <div className="flex justify-between">
                  <span>Total payable</span>
                  <span>{`₤${totalPrice}`}</span>
                </div>
              </div>
              <div className="basket-action px-4 py-3">
                <div className="price">
                  <p>Total</p>
                  <span>{`₤${totalPrice}`}</span>
                </div>
                <Link href="/checkout" className="btn btn-success">
                  continue
                </Link>
              </div>
            </section>
          </MobilePageLayout>
        </div>
      )}
    </main>
  );
};

export default Cart;
