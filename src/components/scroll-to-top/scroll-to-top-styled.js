import styled from "styled-components";

export const StyledScrollToTopButton = styled.button`
  position: fixed;
  bottom: 70px;
  right: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: var(--primary-theme-color);
  opacity: 0.7;
  color: white;
  border: none;
  border-radius: 5px;
  fontsize: 16px;
  line-height: 18.52px;
  width: 48px;
  height: 48px;
  border: 1px solid #ccc;
  cursor: pointer;
  z-index: 1000;
`;
