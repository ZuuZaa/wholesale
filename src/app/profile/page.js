import Image from "next/image";
import "./profile.scss";
import bell from "@/assets/icons/bell.svg";
import chat from "@/assets/icons/chat.svg";
import pack from "@/assets/icons/package.svg";
import location from "@/assets/icons/location.svg";
import returnIcon from "@/assets/icons/return.svg";
import question from "@/assets/icons/question.svg";
import instagram from "@/assets/icons/instagram.png";
import whatsap from "@/assets/icons/whatsap.png";
import Link from "next/link";

const Profile = () => {
  return (
    <main>
      <div className="profile--mobile">
        <div className="profile-header">
          <div className="profile-info">
            <div className="profile-photo"></div>
            <div>
              <p className="user-name">NAME SURNAME</p>
              <p className="user-email">your@gmail.com</p>
            </div>
          </div>
          <div className="flex justify-center items-center">
            <button>
              <Image src={bell} width={15} height={15} alt="notification" />
            </button>
          </div>
        </div>
        <div className="contact">
          <button className="btn-with-icon">
            <Image src={chat} width={22} height={22} alt="contact" />
            <span>Contact</span>
          </button>
          <button className="btn-with-icon">
            <Image src={pack} width={22} height={22} alt="package" />
            <span>Reorder</span>
          </button>
        </div>
        <div className="links">
          <ul className="main-links flex flex-col gap-3 pb-4">
            <li className="flex items-center gap-4">
              <Image src={pack} width={22} height={22} alt="orders" />
              <span>My orders</span>
            </li>
            <li className="flex items-center gap-4">
              <Image src={location} width={22} height={22} alt="location" />
              <span>Saved address</span>
            </li>
            <li className="flex items-center gap-4">
              <Image src={returnIcon} width={22} height={22} alt="return" />
              <span>Return requests</span>
            </li>
          </ul>
          <ul className="flex flex-col gap-3 pl-9 pt-4">
            <li>
              <Link href="#">About us</Link>
            </li>
            <li>
              <Link href="#">Terms of use</Link>
            </li>
            <li>
              <Link href="#">Privacy policy</Link>
            </li>
            <li>
              <Link href="#">Sign out</Link>
            </li>
          </ul>
        </div>
        <div className="questions">
          <ul>
            <li className="flex items-center gap-4 p-3">
              <Image src={question} width={22} height={22} alt="question" />
              <span>Frequently Asked Questions</span>
            </li>
            <li className="pl-12 py-3">My order status</li>
            <li className="pl-12 py-3">How to return items</li>
            <li className="pl-12 py-3">Delivery</li>
            <li className="pl-12 py-3">Payment methods</li>
          </ul>
        </div>
        <div className="sosial-links flex gap-4">
          <Image src={instagram} width={22} height={22} alt="question" />
          <Image src={whatsap} width={22} height={22} alt="question" />
        </div>
      </div>
    </main>
  );
};

export default Profile;
