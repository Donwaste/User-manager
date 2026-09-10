import Qualities from "./qualities";

interface QualitiesCardProps {
  data: string[];
}

const QualitiesCard = ({ data }: QualitiesCardProps) => {
  return (
    <div className="card mb-3">
      <div className="card-body d-flex flex-column justify-content-center text-center">
        <h5 className="card-title">
          <span>Qualities</span>
        </h5>
        <p className="card-text">
          <Qualities qualities={data} />
        </p>
      </div>
    </div>
  );
};

export default QualitiesCard;
