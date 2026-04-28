type ChevronRightIconProps = {
  className?: string;
  strokeWidth?: number;
};

export const ChevronRightIcon = ({
  className = "size-4",
  strokeWidth = 2,
}: ChevronRightIconProps) => {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={strokeWidth}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
    </svg>
  );
};
