import { SuccessAlert } from './alert/success-alert';
import { WarningAlert } from './alert/warning-alert';
import { Loader } from './loader';

type SynchronizationStatusProps = {
  entityName: string;
  handleSynchronize: () => void;
  isPending: boolean;
  isSynchronized: boolean;
};

export const SynchronizationStatus = ({
  entityName,
  handleSynchronize,
  isPending,
  isSynchronized,
}: SynchronizationStatusProps) => {
  return (
    <div className="flex flex-row gap-4">
      {isSynchronized ? (
        <SuccessAlert message={`${entityName} is synchronized.`} />
      ) : (
        <div className="flex flex-row gap-4">
          <WarningAlert message={`${entityName} is not yet synchronized.`} />
          <button
            className="btn-primary flex flex-row items-center gap-2"
            onClick={handleSynchronize}
            disabled={isPending}
          >
            {isPending && <Loader />}
            Synchronize
          </button>
        </div>
      )}
    </div>
  );
};
