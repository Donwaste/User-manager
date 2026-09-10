import { useQualities } from "../../../hooks/useQualities";

const Quality = ({ id }: { id: string }) => {
  const { getQuality } = useQualities();
  const quality = getQuality(id);

  if (!quality) {
    return null;
  }

  const { _id, name, color } = quality;

  return (
    <span className={"badge m-1 bg-" + color} key={_id}>
      {name}
    </span>
  );
};

export default Quality;
