import styled from "styled-components";

export const StyledProductCard = styled.div`
  border-radius: 4px;
  border: 0.3px solid #707070;
  background-color: #fff;

  .product-image {
    height: ${({ height }) => height || "13vh"};
    background-color: #d9d9d9;
    border-radius: 4px 4px 0 0;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      border-radius: 4px 4px 0 0;
    }
  }

  .product-info {
    padding: 4px 8px;

    p {
      color: #454545;
      font-size: 11px;
      font-weight: 400;
      line-height: 15.4px;
      height: 30px;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
      white-space: wrap;
      text-overflow: ellipsis;
    }

    span {
      font-size: 14px;
      font-weight: 500;
      line-height: 18.2px;
    }
  }

  .card-action {
    display: flex;
    justify-content: flex-end;
    width: 100%;

    button {
      width: 100%;
      max-width: 100px;
      padding: 4px 12px;
      border-radius: 18px;
      font-size: 12px;
      font-weight: 500;
      line-height: 13.5px;
      box-shadow: 0px 1px 2px 0px #0000000d;
    }
  }

  .btn-success {
    background: var(--primary-theme-color);
    color: #fff;

    &:hover {
      background: hsl(0, 0%, 85%);
      color: var(--primary-theme-color);
    }
  }
`;
