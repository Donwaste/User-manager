interface BookMarkProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  status: boolean;
}

const BookMark = ({ status, ...rest }: BookMarkProps) => {
  return (
    <button {...rest}>
      <i className={"bi bi-bookmark" + (status ? "-heart-fill" : "")}></i>
    </button>
  );
};

export default BookMark;
