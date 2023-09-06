import Image from 'components/Image';

type Props = {
  first_name: string;
  last_name: string;
  profile_image: string;
  initial_color?: string;
};

const Creator = (props: Props) => {
  const { first_name, last_name, profile_image, initial_color } = props;
  return (
    <div className="img__wrapper w-[40px] h-[40px] sm:w-[28px] sm:h-[28px]">
      <div
        className="w-[70px] h-[70px] noName__letter rounded-full flex items-center justify-center"
        style={{ backgroundColor: 'var(--ipGreen__transparentBG)' }}
      >
        <Image
          imgPath={profile_image}
          first_name={first_name}
          last_name={last_name}
          serverPath
          color={initial_color}
        />
      </div>
    </div>
  );
};

export default Creator;
