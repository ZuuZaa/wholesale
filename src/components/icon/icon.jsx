import styled from "styled-components";

const Icon = ({ name, size, color, hover }) => {
  return (
    <StyledIcon color={color} size={size}>
      <i class={`icon icon-${name}`}></i>
    </StyledIcon>
  );
};

const StyledIcon = styled.span`
  .icon:before {
    color: ${({ color }) => color || "#555"};
    font-size: ${({ size }) => size || "1.2rem"};

    &:hover {
      color: ${({ hover }) => hover};
    }
  }
`;

export default Icon;
