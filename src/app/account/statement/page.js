"use client";
import MobilePageLayout from "@/components/layout/mobile-page-layout";
import { useEffect, useState } from "react";
import { StatementList } from "@/components/lists";
import { StatusTabs } from "@/components/tabs";

const Statement = () => {
  const [data, setData] = useState({
    user: [],
    userAddress: [],
    statements: [
      {
        id: 1000637,
        quantity: 0.0,
        total: 288.0,
        paymentType: 0,
        shippingType: 0,
        payment: 0,
        paymentStatus: 1,
        deliveryFee: 0,
        discount: 0.0,
        coupon: 0,
        vat: 48.0,
        shippingName: "",
        minDayCount: 0,
        maxDayCount: 0,
        amount: 240.0,
        firstName: "Famil",
        lastName: "Kazimzade",
        soldDate: "2024-05-10T00:00:00",
        status: 1,
        addressLine1: "",
        addressLine2: "",
        city: "",
        country: "0",
        zipCode: "",
        useCredit: 0,
        usedBalance: 0,
        creditSum: 0,
        credit: 0.0,
      },
    ],
  });

  const [activeStatus, setActiveStatus] = useState(0);
  const [filteredByStatusStatements, setFilteredByStatusStatements] = useState(
    []
  );
  const tabClickHandle = (status) => {
    setActiveStatus(status);
  };

  useEffect(() => {
    const filteredStatements = data?.statements?.filter(
      (item) => item.status == activeStatus
    );
    setFilteredByStatusStatements(filteredStatements);
  }, [activeStatus]);

  return (
    <main>
      <div className="statements-page">
        <MobilePageLayout title="statements">
          <StatusTabs
            tabClickHandle={tabClickHandle}
            activeStatus={activeStatus}
          />
          <div className="py-3">
            <StatementList orders={filteredByStatusStatements} />
          </div>
        </MobilePageLayout>
      </div>
    </main>
  );
};

export default Statement;
