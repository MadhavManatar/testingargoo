// ** Components **
// import Breadcrumbs from 'components/Breadcrumbs';
// import Button from 'components/Button';
// import { BREAD_CRUMB } from 'constant';
import StreamList from './components/streamList/StreamList';

const Streams = () => {
  return (
    <>
      {/* <Breadcrumbs path={BREAD_CRUMB.streams} /> */}

      <StreamList />
    </>
  );
};

export default Streams;
