import { useSelector } from "react-redux";
import Quality from "./quality";
import { getQualitiesStatus } from "../../../store/qualities";
import Spinner from "../../common/spinner";
interface QualitiesListProps {
  qualities: string[];
}

const QualitiesList = ({ qualities }: QualitiesListProps) => {
  const isLoading = useSelector(getQualitiesStatus());

  if (isLoading) {
    return <Spinner size="sm" />;
  }
  if (!qualities || qualities.length === 0) return null;
  return (
    <>
      {qualities.map((qual) => (
        <Quality key={qual} id={qual} />
      ))}
    </>
  );
};

export default QualitiesList;
