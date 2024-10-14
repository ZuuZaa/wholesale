"use client";

import MobilePageLayout from "@/components/layout/mobile-page-layout";
import { useEffect, useState } from "react";
import { StatementList } from "@/components/lists";
import CardFrame from "@/components/cards/card-frame/card-frame";
import BottomFixedCard from "@/components/cards/bottom-fixed-card";
import { fetchData } from "@/utils/fetch-api";
import "./statements.scss";
import { DatePicker, Modal } from "antd";
import Loading from "@/components/loading";
import dayjs from "dayjs";

const Statement = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [statements, setStatements] = useState([]);
  const [summaries, setSummaries] = useState([]);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [email, setEmail] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [activeButton, setActiveButton] = useState("get");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    if (email) {
      const fetchDataAsync = async () => {
        try {
          const response = await fetchData("getStatement", true, {
            StartDate: startDate?.format("YYYY-MM-DD"),
            EndDate: endDate?.format("YYYY-MM-DD"),
            Email: email,
          });
        } catch (error) {
          setErrorMessage(error.message);
        } finally {
          setIsModalOpen(false);
        }
      };
      fetchDataAsync();
    } else {
      setErrorMessage("please enter email address");
    }
  };

  const handleCancel = () => {
    setEmail(null);
    setErrorMessage(null);
    setIsModalOpen(false);
  };

  const onStartDateChange = (date) => {
    setStartDate(date);
  };

  const onEndDateChange = (date) => {
    setEndDate(date);
  };

  const handleGetStatementsClick = (e) => {
    setActiveButton(e.target.value);
    const fetchDataAsync = async () => {
      try {
        const response = await fetchData("getStatement", true, {
          StartDate: startDate?.format("YYYY-MM-DD"),
          EndDate: endDate?.format("YYYY-MM-DD"),
        });
        setSummaries(response.Summaries);
        setStatements(response.Statements);
      } catch (error) {
        console.error(error.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchDataAsync();
  };

  const handleSendStatementsClick = (e) => {
    setActiveButton(e.target.value);
    showModal();
  };

  useEffect(() => {
    const currentDate = dayjs();
    const previousMonthSameDay = currentDate.subtract(1, "month");
    setStartDate(previousMonthSameDay);
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
              <div className="flex gap-2 mb-2">
                <button
                  className={`statement-btn w-full ${
                    activeButton === "get" ? "active" : ""
                  }`}
                  value="get"
                  onClick={handleGetStatementsClick}
                  disabled={!(startDate && endDate)}
                >
                  Get statements
                </button>
                <button
                  className={`statement-btn w-full ${
                    activeButton === "send" ? "active" : ""
                  }`}
                  value="send"
                  onClick={handleSendStatementsClick}
                  disabled={!(startDate && endDate)}
                >
                  Send statements
                </button>
              </div>
              <Modal
                title="Enter your email address, please."
                open={isModalOpen}
                onOk={handleOk}
                onCancel={handleCancel}
                okButtonProps={{
                  style: { backgroundColor: "var(--primary-theme-color)" },
                }}
                cancelButtonProps={{
                  style: {
                    color: "var(--secondary-theme-color)",
                    border: "1px solidvar(--secondary-theme-color)",
                    outline: "1px solidvar(--secondary-theme-color)",
                  },
                }}
              >
                <input
                  type="email"
                  placeholder="Enter"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{
                    borderRadius: "5px",
                    outline: "1px solid var(--primary-theme-color)",
                  }}
                />
                <p
                  style={{
                    color: "var(--error-color)",
                  }}
                >
                  {errorMessage}
                </p>
              </Modal>
              {/* <button
                className="get-statements-btn"
                onClick={handleGetStatementsClick}
              >
                Get statements
              </button> */}
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
                                item.summary > 0 ? "color-premium" : "color-red"
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
