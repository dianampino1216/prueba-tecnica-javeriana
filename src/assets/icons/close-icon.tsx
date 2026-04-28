type CloseIconProps = {
  className?: string;
  strokeWidth?: number;
};

export const CloseIcon = ({
  className = "size-4",
  strokeWidth = 2,
}: CloseIconProps) => {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={strokeWidth}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
};
