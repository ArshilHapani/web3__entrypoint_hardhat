import { twMerge } from "tailwind-merge";

type Props = {
  title: string;
  className?: string;
};

const Heading = ({ title, className }: Props) => {
  return (
    <div className={twMerge("border-b mb-10", className)}>
      <h1 className="text-4xl font-bold">{title}</h1>
    </div>
  );
};

export default Heading;
