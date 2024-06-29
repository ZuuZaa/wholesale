import { StyledMobilePageLayout } from "./mobile-page-layout.style";

const MobilePageLayout = ({
  title,
  children,
  enableTitleFixedPosition = false,
}) => {
  return (
    <StyledMobilePageLayout enableTitleFixedPosition={enableTitleFixedPosition}>
      <div className="page-header">
        <h2>{title}</h2>
      </div>
      <div className="py-2">{children}</div>
    </StyledMobilePageLayout>
  );
};

export default MobilePageLayout;
