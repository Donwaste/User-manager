import Quality from "./quality";
import { QualityType } from "../../../types";

interface QualitiesListProps {
  qualities: QualityType[];
}

const QualitiesList = ({ qualities }: QualitiesListProps) => {
  return (
    <>
      {qualities.map((qual) => (
        <Quality key={qual._id} {...qual} />
      ))}
    </>
  );
};

export default QualitiesList;
