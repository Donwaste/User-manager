import { useAppSelector } from "../../../store/hooks";
import { getQualityById } from "../../../store/qualities";

const Quality = ({ id }: { id: string }) => {
  const quality = useAppSelector(getQualityById(id));

  if (!quality) {
    return null;
  }

  const { name, color } = quality;

  return <span className={"badge m-1 bg-" + color}>{name}</span>;
};

export default Quality;
