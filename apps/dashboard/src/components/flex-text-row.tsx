type FlexTextRowProps = {
  label: string;
  value: string;
};

export const FlexTextRow = ({ label, value }: FlexTextRowProps) => {
  return (
    <div className="flex flex-row justify-between">
      <strong>{label}</strong>
      <span>{value}</span>
    </div>
  );
};
