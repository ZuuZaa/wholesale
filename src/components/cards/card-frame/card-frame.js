import "./card-frame.scss";

const CardFrame = ({ title, children }) => {
  return (
    <div className="card-frame">
      {title && <h3 className="card-title">{title}</h3>}
      {children}
    </div>
  );
};

export default CardFrame;
