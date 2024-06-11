import Image from 'next/image';
import searchIcon from "@/assets/icons/search.svg";
import "./search-bar.scss";


const SearchBar = ({searchKey, handleInputChange}) => {
  return (
    <div className="search-box-container">
      <div className="search-box">
        <figure className="flex justify-center items-center">
          <Image src={searchIcon} width={15} height={15} alt="search" />
        </figure>
        <input
          type="text"
          placeholder="search in favorites"
          value={searchKey}
          onChange={handleInputChange}
        />
      </div>
    </div>
  );
}

export default SearchBar;