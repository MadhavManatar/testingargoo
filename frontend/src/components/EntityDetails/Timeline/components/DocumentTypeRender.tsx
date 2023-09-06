// ** components **
import Icon from 'components/Icon';
import Image from 'components/Image';
import { DocumentTimeline } from '../types';

type Props = {
    document: DocumentTimeline
}

export const DocumentTypeRender = (props: Props) => {
    const { doc_details, url } = props.document;
    const renderFile = () => {
        switch (doc_details.mimeType?.split('/')[0]) {
            case 'image':
                return <div className="flex items-center justify-center img__loader">
                    <Image
                        imgClassName="img__element block absolute top-0 left-0 !w-full !h-full object-cover object-center rounded-[10px] duration-500 hover:blur-[0px] border border-whiteScreen__BorderColor"
                        imgPath={url}
                        serverPath
                    />
                </div>
            case 'video':
                return <div className="flex items-center justify-center img__loader">
                    <Icon className="w-full h-full p-[13px]" iconType="videoIconFilledPrimaryColor" />
                </div>
            default:
                return (
                    <div className="flex items-center justify-center img__loader">
                        <Icon className="w-full h-full p-[13px]" iconType='fileIconFilledPrimaryColor' />
                    </div>)
        }
    };
    return renderFile();
};
