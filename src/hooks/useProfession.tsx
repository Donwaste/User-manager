import { createContext, useContext, useState, useEffect } from "react";
import professionService from "../services/profession.service";
import { toast } from "react-toastify";
import { ProfessionType, ProviderProps } from "../types";
import { getErrorMessage } from "../utils/getErrorMessage";

interface ProfessionContextType {
  professions: ProfessionType[];
  isLoading: boolean;
  getProfession: (id: string) => ProfessionType | undefined;
}

const ProfessionContext = createContext<ProfessionContextType | undefined>(
  undefined,
);

export const useProfessions = () => {
  const context = useContext(ProfessionContext);
  if (context === undefined) {
    throw new Error("useProfessions must be used within a ProfessionProvider");
  }
  return context;
};

export const ProfessionProvider = ({ children }: ProviderProps) => {
  const [professions, setProfessions] = useState<ProfessionType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getProfessionList();
  }, []);

  useEffect(() => {
    if (error !== null) {
      toast.error(error);
      setError(null);
    }
  }, [error]);

  const getProfession = (id: string) => {
    return professions.find((p) => p._id === id);
  };
  async function getProfessionList() {
    try {
      const { content } = await professionService.get();
      setProfessions(content);
      setIsLoading(false);
    } catch (error) {
      errorCatcher(error);
    }
  }

  const errorCatcher = (error: unknown) => {
    setError(getErrorMessage(error));
    setIsLoading(false);
  };

  return (
    <ProfessionContext.Provider
      value={{ professions, isLoading, getProfession }}
    >
      {!isLoading ? children : "Loading..."}
    </ProfessionContext.Provider>
  );
};
