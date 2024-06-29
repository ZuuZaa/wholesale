import styled from "styled-components";

export const StyledMobilePageLayout = styled.div`
  padding: 50px 10px 60px;
  height: 100vh;
  overflow-y: scroll;
  color: #454545;
  background-color: #f1f1f1;
  position: relative;

  &:has(.total-bottom) {
    padding-bottom: 130px;
  }
  &:has(.bottom-fixed-card) {
    padding-bottom: 230px;
  }

  .page-header {
    position: ${({ enableTitleFixedPosition }) =>
      enableTitleFixedPosition ? "static" : "sticky"};
    top: -2px;
    z-index: 4;
    padding-block: 12px 10px;
    background-color: rgba(241, 241, 241, 0.8);

    h2 {
      font-size: 11px;
      font-weight: 500;
      line-height: 13.86px;
      text-align: center;
      text-transform: capitalize;
      padding-block: 10px;
      border-radius: 8px;
      box-shadow: 0px 2px 4px 0px #00000040;
      background-color: #fff;
    }
  }
`;
