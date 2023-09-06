// **  import packages ** //
import React from 'react';
import { Link } from 'react-router-dom';

// ** Hooks-services ** //
import useWindowDimensions from 'hooks/useWindowDimensions';

interface Props {
  path: {
    trails: { title: string; path: string }[];
    title: string;
  };
}

const Breadcrumbs = (props: Props) => {
  const { path } = props;
  const { isMobileView } = useWindowDimensions();


  return !isMobileView ? (
    <div className='breadcrumbs__wrapper relative before:content-[""] before:absolute before:top-0 before:right-0 before:h-full before:w-[26px] before:bg-gradient-to-r before:from-[#fff0] before:to-[#fff] before:z-[2] before:hidden md:before:block'>
      <div className="breadcrumbs mb-[20px] md:mb-[10px] whitespace-pre overflow-x-auto">
        {React.Children.toArray(
          path.trails.map((trail) => (
            <Link to={trail.path} className="breadcrumbLink">
              {trail.title}
            </Link>
          ))
        )}
        <span className="breadcrumbLink active">{path.title}</span>
      </div>
    </div>
  ) : (
    <></>
  );
};

export default Breadcrumbs;
