import { Link, To } from 'react-router-dom';

type CustomLinkProps = {
  linkTitle: string;
  to: To;
  capitalize?: boolean;
  newTab?: boolean;
};

export const CustomLink = ({ capitalize, linkTitle, newTab, to }: CustomLinkProps) => {
  return (
    <Link
      to={to}
      className={`text-blue-400 underline hover:text-blue-700 ${capitalize ? 'capitalize' : ''}`}
      {...(newTab ? { target: '_blank' } : {})}
    >
      {linkTitle}
    </Link>
  );
};
