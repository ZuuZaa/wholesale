import './mobile-page-layout.scss';

const MobilePageLayout = ({title, children}) => {
  return (
    <div className="mobile-page-layout">
      <h2 className="page-header">{title}</h2>
      {children}
    </div>
  );
}

export default MobilePageLayout;