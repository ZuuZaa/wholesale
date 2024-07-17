import Image from "next/image";
import "./title-with-icon.scss";

const TitleWithIcon = ({ icon, title, reverse = false, justify = false }) => {
  return (
    <figure
      className={`
        title-with-icon flex 
        ${reverse ? "flex-row-reverse" : ""} 
        ${justify ? "justify-center" : ""} 
        items-center gap-4`}
    >
      <Image src={icon} width={22} alt="title-icon" />
      <figcaption>{title}</figcaption>
    </figure>
  );
};

export default TitleWithIcon;
