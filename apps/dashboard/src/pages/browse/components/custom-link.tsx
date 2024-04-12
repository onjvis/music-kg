import { Link, To } from 'react-router-dom';

type CustomLinkProps = {
  linkTitle: string;
  to: To;
  capitalize?: boolean;
};

export const CustomLink = ({ capitalize, linkTitle, to }: CustomLinkProps) => {
  return (
    <Link to={to} className={`text-blue-400 underline hover:text-blue-700 ${capitalize ? 'capitalize' : ''}`}>
      {linkTitle}
    </Link>
  );
};
