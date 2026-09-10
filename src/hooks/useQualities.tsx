import { createContext, useContext, useState, useEffect } from "react";
import qualityService from "../services/quality.service";
import { toast } from "react-toastify";
import { QualityType, ProviderProps } from "../types";
import { getErrorMessage } from "../utils/getErrorMessage";

interface QualityContextType {
  qualities: QualityType[];
  isLoading: boolean;
  getQuality: (id: string) => QualityType | undefined;
}

const QualityContext = createContext<QualityContextType>({
  qualities: [],
  isLoading: true,
  getQuality: () => undefined,
});

export const useQualities = () => {
  return useContext(QualityContext);
};

const QualityProvider = ({ children }: ProviderProps) => {
  const [qualities, setQualities] = useState<QualityType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getQualitiesList();
  }, []);

  useEffect(() => {
    if (error !== null) {
      toast.error(error);
      setError(null);
    }
  }, [error]);

  const getQuality = (id: string) => {
    return qualities.find((quality) => quality._id === id);
  };

  async function getQualitiesList() {
    try {
      const { content } = await qualityService.get();
      setQualities(content);
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
    <QualityContext.Provider value={{ qualities, isLoading, getQuality }}>
      {!isLoading ? children : "Loading..."}
    </QualityContext.Provider>
  );
};

export default QualityProvider;
