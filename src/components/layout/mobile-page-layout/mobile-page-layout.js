import './mobile-page-layout.scss';

const MobilePageLayout = ({title, children}) => {
  return (
    <div className="mobile-page-layout">
      <div className="page-header">
        <h2>{title}</h2>
      </div>
      {children}
    </div>
  );
}

export default MobilePageLayout;