import Image from "next/image";
import "./title-with-icon.scss";
import Icon from "@/components/icon";

const TitleWithIcon = ({ icon, title, reverse = false, justify = false }) => {
  return (
    <figure
      className={`
        title-with-icon flex 
        ${reverse ? "flex-row-reverse" : ""} 
        ${justify ? "justify-center" : ""} 
        items-center gap-4`}
    >
      <Icon name={icon} color="var(--primary-theme-color)" />
      <figcaption>{title}</figcaption>
    </figure>
  );
};

export default TitleWithIcon;
