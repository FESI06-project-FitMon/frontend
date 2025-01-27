interface NullProps {
  message?: string;
  svg?: React.ReactNode;
}

export default function Null({ message, svg }: NullProps) {
  return (
    <div className="w-full h-[227px] flex-shrink-0 bg-dark-200 rounded-[20px] flex items-center justify-center">
      {svg ? (
        <div>{svg}</div>
      ) : (
        <span className="text-white font-normal">{message}</span>
      )}
    </div>
  );
}
