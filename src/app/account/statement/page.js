"use client";
import MobilePageLayout from "@/components/layout/mobile-page-layout";
import { useEffect, useState } from "react";
import { StatementList } from "@/components/lists";
import { StatusTabs } from "@/components/tabs";
import CardFrame from "@/components/cards/card-frame/card-frame";
import TitleWithIcon from "@/components/typography/title-with-icon/title-with-icon";
import DateIcon from "@/assets/icons/date.svg";
import { dateNormalizer } from "@/helpers";
import BottomFixedCard from "@/components/cards/bottom-fixed-card";
import { fetchData } from "@/utils/fetch-api";

const Statement = () => {
  const [isLoading, setIsLoading] = useState(false);

  const [data, setData] = useState({
    user: [],
    dates: {
      start_date: "2024-05-10T00:00:00",
      end_date: "2024-05-20T00:00:00",
    },
    statements: [
      {
        id: 1000637,
        title: "Receivable-6",
        total: 288.0,
        date: "2024-05-10T00:00:00",
        status: 1,
      },
      {
        id: 1000638,
        title: "Cash inflow-3",
        total: -288.0,
        date: "2024-05-10T00:00:00",
        status: 2,
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
    const fetchDataAsync = async () => {
      setIsLoading(true);
      try {
        const response = await fetchData("getStatements", true);
        console.log(response);
      } catch (error) {
        console.error(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDataAsync();
  }, []);

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
          <div className="grid grid-cols-2 gap-2 py-3">
            <CardFrame>
              <TitleWithIcon
                icon={DateIcon}
                title={dateNormalizer(data?.dates?.start_date)}
                justify={true}
              />
            </CardFrame>
            <CardFrame>
              <TitleWithIcon
                icon={DateIcon}
                title={dateNormalizer(data?.dates?.end_date)}
                justify={true}
                reverse={true}
              />
            </CardFrame>
          </div>
          <StatementList list={filteredByStatusStatements} />
          <BottomFixedCard>
            <CardFrame>
              <div className="flex flex-col gap-2 p-1">
                <div className="flex justify-between">
                  <span className="color-muted">First Balance</span>
                  <b className="color-green">{`₤${1000.0}`}</b>
                </div>
                <div className="flex justify-between">
                  <span className="color-muted">Owed</span>
                  <b className="color-green">{`₤${500.0}`}</b>
                </div>
                <div className="flex justify-between">
                  <span className="color-muted">Paid</span>
                  <b className="color-red">{`-₤${400.0}`}</b>
                </div>
                <div className="flex justify-between">
                  <b>Balance</b>
                  <b className="color-green">{`₤${1000.0}`}</b>
                </div>
              </div>
            </CardFrame>
          </BottomFixedCard>
        </MobilePageLayout>
      </div>
    </main>
  );
};

export default Statement;
