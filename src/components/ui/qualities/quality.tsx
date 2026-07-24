interface QualityProps {
  color: string;
  name: string;
}

const Quality = ({ color, name }: QualityProps) => {
  return <span className={"badge m-1 bg-" + color}>{name}</span>;
};

export default Quality;
