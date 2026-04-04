const SearchStatus = ({ length }) => {
  const renderPhrase = (number) => {
    return number === 1 ? "person will hang out" : "people will hang out";
  };
  return (
    <h2>
      <span className={"badge " + (length > 0 ? "bg-primary" : "bg-danger")}>
        {length > 0
          ? `${length} ${renderPhrase(length)} with you today`
          : "Nobody needs you "}
      </span>
    </h2>
  );
};
export default SearchStatus;
