import Icon from "@/components/icon";
import { StyledSearchBar } from "./search-bar-styled";

const SearchBar = ({
  searchKey,
  handleInputChange,
  topPosition,
  placeholder = "search...",
}) => {
  return (
    <StyledSearchBar top={topPosition}>
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
    </StyledSearchBar>
  );
};

export default SearchBar;
