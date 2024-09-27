import { StyledMobilePageLayout } from "./mobile-page-layout.style";

const MobilePageLayout = ({ title, children, fixedTitle }) => {
  
  return (
    <StyledMobilePageLayout className={`${fixedTitle ? "fixed-title" : ""}`}>
      {title && (
        <div className="page-header">
          <h2>{title}</h2>
        </div>
      )}
      <div className="py-2">{children}</div>
    </StyledMobilePageLayout>
  );
};

export default MobilePageLayout;
