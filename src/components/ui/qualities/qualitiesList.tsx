import Quality from "./quality";
import { useQualities } from "../../../hooks/useQualities";

interface QualitiesListProps {
  qualities: string[];
}

const QualitiesList = ({ qualities }: QualitiesListProps) => {
  const { isLoading } = useQualities();

  if (isLoading) {
    return <p>Loading...</p>;
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
