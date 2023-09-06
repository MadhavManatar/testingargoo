import { memo, useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { getNotificationParams } from 'redux/slices/notificationSlice';
import { UserNotification } from '../types/notification.types'
import { useNotificationService } from '../useNotificationService';
import NotificationItems from './NotificationItems'

interface Props {
    notification: UserNotification,
    indexNo: number
}

const RenderItemsHandler = ({ notification, indexNo }: Props) => {
    const params = useSelector(getNotificationParams)
    const [showMore, setShowMore] = useState(false)
    const { markAsRead } = useNotificationService();
    useEffect(() => {
        setShowMore(false)
    }, [params])
    return (
        <>
            <NotificationItems
                indexNo={[indexNo]}
                showMoreHandler={() => setShowMore(true)}
                showMore={showMore}
                notification={notification}
                markAsRead={markAsRead}
                isParent
            />
            {notification?.groupNotifications && notification?.groupNotifications?.map((item, index) => (
                <NotificationItems
                    indexNo={[indexNo, index]}
                    key={`${item?.notification?.created_at}_notification_item_${index}`}
                    notification={item}
                    showMore={showMore}
                    markAsRead={markAsRead}
                    isLastIndex={(notification?.groupNotifications || []).length - 1 === index}
                />)
            )}
            {notification?.groupNotifications && showMore &&
                <div id={`show_less_${notification?.notification_id}`} className="mt-[3px] px-[15px]">
                    <button onClick={() => setShowMore(false)} className="text-[12px] font-biotif__Medium text-primaryColor">
                        Show Less
                    </button>
                </div>}
        </>
    )
}

export default memo(RenderItemsHandler)