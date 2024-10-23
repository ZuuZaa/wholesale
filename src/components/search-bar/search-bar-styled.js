import styled from "styled-components";

export const StyledSearchBar = styled.div`
  position: sticky;
  top: ${({ top }) => top || "-0.6rem"};
  background-color: #f1f1f1cc;
  padding-block: 0.5rem;

  .search-box {
    display: grid;
    grid-template-columns: 36px auto;
    border: 0.4px solid #828282;
    border-radius: 2px;
    color: #828282;
    background-color: #fff;

    input {
      height: 36px;
      border: none;
      outline: none;
      padding-left: 0;
    }
  }
`;