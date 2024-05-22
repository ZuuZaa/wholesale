import styled from "styled-components";

export const StyledProductCard = styled.div`
  border-radius: 4px;
  border: 0.3px solid #707070;

  .product-image {
    position: relative;
    height: ${({ height }) => height || "13vh"};
    background-color: #d9d9d9;
    border-radius: 4px 4px 0 0;

    img:not(.star-icon, .favorite-icon) {
      width: 100%;
      height: 100%;
      object-fit: cover;
      border-radius: 4px 4px 0 0;
    }

    .btn-favorite {
      position: absolute;
      top: 7px;
      right: 7px;
      z-index: 2;
      border: none;
      outline: none;
    }

    .favorite-icon {
      width: 10px;
      height: 15px;

      &:is(.favorite) {
        filter: brightness(0) saturate(100%) invert(99%) sepia(100%)
          saturate(1312%) hue-rotate(74deg) brightness(96%) contrast(84%);
      }
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
      font-size: 13px;
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
      padding: 5px 14px;
      border-radius: 18px;
      font-size: 9px;
      font-weight: 500;
      line-height: 13.5px;
      box-shadow: 0px 1px 2px 0px #0000000d;
    }
  }

  .btn-success {
    background: #3fe29e;
    color: #fff;

    &:hover {
      background: hsl(155, 74%, 47%);
    }
  }
`;
