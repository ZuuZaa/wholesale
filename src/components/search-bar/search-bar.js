import Icon from "@/components/icon";
import "./search-bar.scss";


const SearchBar = ({ searchKey, handleInputChange, placeholder="search..."}) => {
  return (
    <div className="search-box-container">
      <div className="search-box">
        <figure className="flex justify-center items-center">
          <Icon
            name="search"
            size="15px"
            color="var(--secondary-theme-color)"
          />
        </figure>
        <input
          type="text"
          placeholder={placeholder}
          value={searchKey}
          onChange={handleInputChange}
        />
      </div>
    </div>
  );
};

export default SearchBar;