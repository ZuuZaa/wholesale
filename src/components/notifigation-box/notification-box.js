import Image from "next/image";
import bellIcon from '@/assets/icons/bell.svg'
import "./notification-box.scss";

const NotificationBox = ({ iconSize = 25 }) => {
  const message = "no notifications";

  return (
    <figure className="notification-box">
      <Image
        src={bellIcon}
        width={iconSize}
        height={iconSize}
        alt="notification"
      />
      <figcaption>{message}</figcaption>
    </figure>
  );
};

export default NotificationBox;
