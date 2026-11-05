import {
  getProfessionById,
  getProfessionsLoadingStatus,
} from "../../store/professions";
import { useAppSelector } from "../../store/hooks";
import Spinner from "../common/spinner";

const Profession = ({ id }: { id: string }) => {
  const isLoading = useAppSelector(getProfessionsLoadingStatus());
  const profession = useAppSelector(getProfessionById(id));

  if (isLoading) return <Spinner size="sm" />;

  return <>{profession?.name}</>;
};

export default Profession;
