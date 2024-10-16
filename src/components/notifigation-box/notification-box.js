import "./notification-box.scss";
import Icon from "@/components/icon";

const NotificationBox = ({ iconSize = "20px" }) => {
  const message = "no notifications";

  return (
    <figure className="notification-box">
      <Icon size={iconSize} name="bell" color="var(--primary-theme-color)" />
      <figcaption>{message}</figcaption>
    </figure>
  );
};

export default NotificationBox;
