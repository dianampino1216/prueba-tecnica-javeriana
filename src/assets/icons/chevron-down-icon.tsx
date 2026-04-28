type ChevronDownIconProps = {
  className?: string;
  strokeWidth?: number;
};

export const ChevronDownIcon = ({
  className = "size-4",
  strokeWidth = 2,
}: ChevronDownIconProps) => {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={strokeWidth}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
    </svg>
  );
};
