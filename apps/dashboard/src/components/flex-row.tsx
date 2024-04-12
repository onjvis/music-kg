import { ReactNode } from 'react';

type FlexRowProps = {
  label: string;
  element: ReactNode;
};

export const FlexRow = ({ label, element }: FlexRowProps) => {
  return (
    <div className="flex flex-row justify-between">
      <strong>{label}</strong>
      {element}
    </div>
  );
};
