import {
  getProfessionById,
  getProfessionsLoadingStatus,
} from "../../store/professions";
import { useAppSelector } from "../../store/hooks";

const Profession = ({ id }: { id: string }) => {
  const isLoading = useAppSelector(getProfessionsLoadingStatus());
  const profession = useAppSelector(getProfessionById(id));

  if (isLoading) return "Loading...";

  return <>{profession?.name}</>;
};

export default Profession;
