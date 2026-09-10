import { useProfessions } from "../../hooks/useProfession";

const Profession = ({ id }: { id: string }) => {
  const { getProfession, isLoading } = useProfessions();
  const profession = getProfession(id);
  if (isLoading) return "Loading...";
  return <>{profession?.name}</>;
};

export default Profession;
