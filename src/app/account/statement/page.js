"use client";

import MobilePageLayout from "@/components/layout/mobile-page-layout";
import { useEffect, useState } from "react";
import { StatementList } from "@/components/lists";
import CardFrame from "@/components/cards/card-frame/card-frame";
import BottomFixedCard from "@/components/cards/bottom-fixed-card";
import { fetchData } from "@/utils/fetch-api";
import "./statements.scss";
import { DatePicker } from "antd";
import Loading from "@/components/loading";
import dayjs from "dayjs";

const Statement = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [statements, setStatements] = useState([]);
  const [summaries, setSummaries] = useState([]);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const onStartDateChange = (date) => {
    setStartDate(date);
  };

  const onEndDateChange = (date) => {
    setEndDate(date);
  };

  const handleGetStatementsClick = () => {
    const fetchDataAsync = async () => {
      try {
        const response = await fetchData("getStatement", true, {
          StartDate: startDate?.format("YYYY-MM-DD"),
          EndDate: endDate?.format("YYYY-MM-DD"),
        });
        setSummaries(response.Summaries);
        setStatements(response.Statements);
        console.log(response);
      } catch (error) {
        console.error(error.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchDataAsync();
  };

  useEffect(() => {
    const currentDate = dayjs();
    const previousMonth = currentDate.subtract(1, "month");
    const startDayPreviousMonth = previousMonth.set("date", 2);
    setStartDate(startDayPreviousMonth);
    setEndDate(currentDate);
    setIsLoading(false);
  }, []);

  return (
    <main>
      <div className="statements-page">
        <MobilePageLayout>
          {isLoading ? (
            <Loading />
          ) : (
            <>
              <div className="grid grid-cols-2 gap-2 py-3">
                <DatePicker
                  onChange={onStartDateChange}
                  format="DD/MM/YYYY"
                  value={startDate}
                  style={{
                    width: "100%",
                  }}
                />
                <DatePicker
                  onChange={onEndDateChange}
                  format="DD/MM/YYYY"
                  value={endDate}
                  style={{
                    width: "100%",
                  }}
                />
              </div>
              <button
                className="get-statements-btn"
                onClick={handleGetStatementsClick}
                disabled={!(startDate && endDate)}
              >
                Get statements
              </button>
              {statements.length > 0 && (
                <>
                  <div className="mt-3">
                    <StatementList list={statements} />
                  </div>
                  <BottomFixedCard>
                    <CardFrame>
                      <div className="flex flex-col gap-2 p-1">
                        {summaries?.map((item, index) => (
                          <div className="flex justify-between" key={index}>
                            <span className="color-muted">{item.title}</span>
                            <b
                              className={
                                item.summary > 0 ? "color-green" : "color-red"
                              }
                            >
                              {`${item.summary < 0 ? "-" : ""}₤${Math.abs(
                                item.summary
                              )}`}
                            </b>
                          </div>
                        ))}
                      </div>
                    </CardFrame>
                  </BottomFixedCard>
                </>
              )}
            </>
          )}
        </MobilePageLayout>
      </div>
    </main>
  );
};

export default Statement;
