import Tippy from '@tippyjs/react';
import DateTimeSince from 'components/DateFormat/DateTimeSince';
import Image from 'components/Image';
import React, { memo, useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux';
import { getNotificationParams } from 'redux/slices/notificationSlice';
import { notificationStatus, UserNotification } from '../types/notification.types';
import ModuleRecordActionType from './NotificationTypes';
import RenderMessage from './RenderMessage';

interface Props {
    indexNo: number[]
    notification: UserNotification;
    showMoreHandler?: () => void;
    showMore?: boolean;
    isLastIndex?: boolean
    markAsRead: (id: number[] | "all", status: boolean, index?: number[]) => void
    isParent?: boolean
}

const NotificationItems = ({ indexNo, notification, showMoreHandler, showMore, isLastIndex = false, markAsRead, isParent = false }: Props) => {
      const params = useSelector(getNotificationParams)
    const inputRef = useRef<HTMLInputElement>(null)
    const creator = notification?.notification?.creator;
    const [status, setStatus] = useState(params['q[status]'] === notificationStatus.UNREAD)
    useEffect(() => {
        setStatus(params['q[status]'] === notificationStatus.UNREAD)
    }, [notification, params])

    const readNotification = (e: React.MouseEvent<HTMLDivElement, MouseEvent> | React.ChangeEvent<HTMLInputElement>, notificationId: number) => {
        const isElemInsideGroup = document.getElementById(`${notificationId}_groupNotification`)
        const isElemInsideShowLess = document.getElementById(`show_less_${notificationId}`)
        if (!isElemInsideGroup?.contains(e.target as Node) && !isElemInsideShowLess?.contains(e.target as Node)) {
            let argStatus = !inputRef.current?.checked
            if (e.target === inputRef.current) {
                argStatus = inputRef.current?.checked
            }
            markAsRead([+notificationId], params['q[status]'] === notificationStatus.READ ? argStatus : !argStatus, indexNo)
            if (inputRef.current) {
                setStatus(!status)
                inputRef.current.checked = e.target === inputRef.current ? inputRef.current?.checked : !inputRef.current?.checked
            }
        }
    }

    return (
        <>
            <div onClick={(e) => inputRef.current && e.target !== inputRef.current && readNotification(e, notification.notification_id)} className={`notification__item relative pt-[15px] pb-[6px] px-[15px] pr-[44px] flex flex-wrap sm:pl-[35px] before:absolute before:left-[33px] before:top-[32px] before:h-[calc(100%_-_20px)] before:w-[1px] before:border-l-[1px] before:border-dashed before:border-l-primaryColor before:opacity-50 last:before:hidden ${isLastIndex ? 'last__item' : ''} ${!isParent ? (showMore ? 'block' : 'hidden') : ''} ${!showMore && isParent ? 'before:hidden' : ''}`}>
                <Tippy
                    key={`${notification.notification_id}_tooltip`}
                    zIndex={7}
                    content={`Mark as ${status ? 'Read' : 'Unread'}`}
                >
                    <div key={`${notification.notification_id}_input_div`} className="custom__checkbox cursor-pointer flex items-center absolute top-[16px] right-[14px] z-[2] sm:left-[12px]">
                        <input
                            className="absolute cursor-pointer top-[0px] left-[0px] w-full h-full opacity-0 z-[2]"
                            type="checkbox"
                            name={`addToMarkAsRead[${notification.notification_id}]`}
                            ref={inputRef}
                            onChange={(e) => readNotification(e, notification.notification_id)}
                            defaultChecked
                        />
                        <span className='custom__checkbox__DE inline-block w-[16px] h-[16px] rounded-full border border-[#CCCCCC]/80 duration-500 before:content-[""] before:w-[8px] before:h-[8px] before:rounded-full before:bg-white before:absolute before:top-[50%] before:left-[50%] before:translate-y-[-50%] before:translate-x-[-50%] before:opacity-0' />
                    </div>
                </Tippy>
                <div className="img__wrapper w-[36px] h-[36px]">
                    <Image
                        imgPath={creator?.profile_image}
                        first_name={creator?.first_name}
                        last_name={creator?.last_name}
                        serverPath
                    />
                </div>
                <div className="contant__cn w-[calc(100%_-_37px)] pl-[10px]">
                    <h5 className="text-[16px] leading-[20px] text-black font-biotif__Regular">
                        {creator?.full_name}
                        <span className="text-[12px] leading-[18px] text-black/50 font-biotif__Regular inline-block ml-[10px]">
                            <DateTimeSince date={notification?.created_at} key={`${new Date(notification?.created_at).getTime()}_notification`} tooltipEnable={false} />
                        </span>
                    </h5>
                    <ModuleRecordActionType notification={notification} />
                    <RenderMessage
                        data={notification}
                        showMoreHandler={showMoreHandler}
                        showMore={showMore}
                    />
                </div>
            </div>
        </>
    )

}

export default memo(NotificationItems)