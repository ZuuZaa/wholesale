import styled from "styled-components";

const Icon = ({ name, size, color, display, onClick }) => {
  return (
    <StyledIcon color={color} size={size} display={display} onClick={onClick} >
      <i className={`icon icon-${name}`}></i>
    </StyledIcon>
  );
};

const StyledIcon = styled.span`
  display: ${({ display }) => display || "flex"};
  align-items: center;
  cursor: pointer;

  .icon:before {
    color: ${({ color }) => color || "#555"};
    font-size: ${({ size }) => size || "1.2rem"};
    font-weight: 100;
  }
`;

export default Icon;
