type FlexTextRowProps = {
  label: string;
  value: string;
  labelClassName?: string;
};

export const FlexTextRow = ({ label, labelClassName, value }: FlexTextRowProps) => {
  return (
    <div className="flex flex-row justify-between">
      <strong>{label}</strong>
      <span className={labelClassName}>{value}</span>
    </div>
  );
};
