import { SuccessAlert } from './alert/success-alert';
import { WarningAlert } from './alert/warning-alert';

type SynchronizationStatusProps = {
  entityName: string;
  handleSynchronize: () => void;
  isSynchronized: boolean;
};

export const SynchronizationStatus = ({
  entityName,
  handleSynchronize,
  isSynchronized,
}: SynchronizationStatusProps) => {
  return (
    <div className="flex flex-row gap-4">
      {isSynchronized ? (
        <SuccessAlert message={`${entityName} is synchronized.`} />
      ) : (
        <div className="flex flex-row gap-4">
          <WarningAlert message={`${entityName} is not yet synchronized.`} />
          <button className="btn-primary" onClick={handleSynchronize}>
            Synchronize
          </button>
        </div>
      )}
    </div>
  );
};
