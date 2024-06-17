import './mobile-page-layout.scss';

const MobilePageLayout = ({title, children}) => {
  return (
    <div className="mobile-page-layout">
      <div className="page-header">
        <h2>{title}</h2>
      </div>
      <div className="py-2">{children}</div>
    </div>
  );
}

export default MobilePageLayout;