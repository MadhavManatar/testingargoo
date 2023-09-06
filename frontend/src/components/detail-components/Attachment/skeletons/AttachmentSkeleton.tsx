
export function AttachmentSkeleton() {
    return (
        <>
            <div className='attachments__sec__header flex flex-wrap items-center justify-between mb-[15px] sm:mb-[10px]'>
                <div className="skeletonBox w-[150px] max-w-full mt-[10px]" />
                <div className="skeletonBox w-[100px] max-w-full mt-[10px] h-[30px] rounded-[8px]" />
            </div>
            <div className='attachments__table__wrapper overflow-x-auto ip__FancyScroll'>
                <div className='attachments__table min-w-[1000px] border border-whiteScreen__BorderColor rounded-[10px]'>
                    <div className='attachments__header py-[15px] border-b border-whiteScreen__BorderColor'>
                        <div className='attachments__row flex flex-wrap'>
                            <div className='attachments__cell w-[calc(25%_-_15px)] px-[20px] text-[18px] font-biotif__Medium file__name'>
                                <div className="skeletonBox w-[80%]" />
                            </div>
                            <div className='attachments__cell w-[calc(25%_-_15px)] px-[20px] text-[18px] font-biotif__Medium attached__by'>
                                <div className="skeletonBox w-[80%]" />
                            </div>
                            <div className='attachments__cell w-[calc(25%_-_15px)] px-[20px] text-[18px] font-biotif__Medium date'>
                                <div className="skeletonBox w-[80%]" />
                            </div>
                            <div className='attachments__cell w-[calc(25%_-_15px)] px-[20px] text-[18px] font-biotif__Medium size'>
                                <div className="skeletonBox w-[80%]" />
                            </div>
                            <div className='attachments__cell w-[60px] text-[18px] font-biotif__Medium toggle__btn'>
                                <div className="skeletonBox w-[80%]" />
                            </div>
                        </div>
                    </div>
                    <div className='attachments__body py-[10px]'>
                        <div className='attachments__row flex flex-wrap'>
                            <div className='attachments__cell w-[calc(25%_-_15px)] px-[20px] pt-[12px] pb-[10px] sm:pt-[8px] sm:pb-[9px] file__name !pr-[20px] before:!hidden'>
                                <div className='skeletonBox w-[60%] mb-[10px] hidden sm:block' />
                                <div className='w-full flex flex-wrap items-center'>
                                    <div className="skeletonBox w-[26px] h-[26px] rounded-[8px] mr-[10px]" />
                                    <div className="skeletonBox w-[calc(100%_-_36px)]" />
                                </div>
                            </div>
                            <div className='attachments__cell flex flex-wrap items-center w-[calc(25%_-_15px)] px-[20px] pt-[12px] pb-[10px] text-[16px] font-biotif__Regular sm:pt-[10px] sm:pb-[12px] attached__by before:!hidden'>
                                <div className='w-full mb-[10px] hidden sm:block'>
                                    <div className="skeletonBox w-[60%]" />
                                </div>
                                <div className="skeletonBox w-[80%] sm:w-[95%]" />
                            </div>
                            <div className='attachments__cell flex flex-wrap items-center w-[calc(25%_-_15px)] px-[20px] pt-[12px] pb-[10px] text-[16px] font-biotif__Regular sm:pt-[10px] sm:pb-[12px] date before:!hidden'>
                                <div className='w-full mb-[10px] hidden sm:block'>
                                    <div className="skeletonBox w-[60%]" />
                                </div>
                                <div className="skeletonBox w-[80%] sm:w-[95%]" />
                            </div>
                            <div className='attachments__cell flex flex-wrap items-center w-[calc(25%_-_15px)] px-[20px] pt-[12px] pb-[10px] text-[16px] font-biotif__Regular sm:pt-[10px] sm:pb-[12px] size before:!hidden'>
                                <div className='w-full mb-[10px] hidden sm:block'>
                                    <div className="skeletonBox w-[60%]" />
                                </div>
                                <div className="skeletonBox w-[80%] sm:w-[95%]" />
                            </div>
                            <div className='attachments__cell flex flex-wrap items-center w-[60px] pt-[12px] pb-[10px] toggle__btn before:!hidden'>
                                <div className='w-full mb-[10px] hidden sm:block'>
                                    <div className="skeletonBox w-[60%]" />
                                </div>
                                <div className="skeletonBox w-[80%] sm:w-[95%]" />
                            </div>
                        </div>
                        <div className='attachments__row flex flex-wrap'>
                            <div className='attachments__cell w-[calc(25%_-_15px)] px-[20px] pt-[12px] pb-[10px] sm:pt-[8px] sm:pb-[9px] file__name !pr-[20px] before:!hidden'>
                                <div className='skeletonBox w-[60%] mb-[10px] hidden sm:block' />
                                <div className='w-full flex flex-wrap items-center'>
                                    <div className="skeletonBox w-[26px] h-[26px] rounded-[8px] mr-[10px]" />
                                    <div className="skeletonBox w-[calc(100%_-_36px)]" />
                                </div>
                            </div>
                            <div className='attachments__cell flex flex-wrap items-center w-[calc(25%_-_15px)] px-[20px] pt-[12px] pb-[10px] text-[16px] font-biotif__Regular sm:pt-[10px] sm:pb-[12px] attached__by before:!hidden'>
                                <div className='w-full mb-[10px] hidden sm:block'>
                                    <div className="skeletonBox w-[60%]" />
                                </div>
                                <div className="skeletonBox w-[80%] sm:w-[95%]" />
                            </div>
                            <div className='attachments__cell flex flex-wrap items-center w-[calc(25%_-_15px)] px-[20px] pt-[12px] pb-[10px] text-[16px] font-biotif__Regular sm:pt-[10px] sm:pb-[12px] date before:!hidden'>
                                <div className='w-full mb-[10px] hidden sm:block'>
                                    <div className="skeletonBox w-[60%]" />
                                </div>
                                <div className="skeletonBox w-[80%] sm:w-[95%]" />
                            </div>
                            <div className='attachments__cell flex flex-wrap items-center w-[calc(25%_-_15px)] px-[20px] pt-[12px] pb-[10px] text-[16px] font-biotif__Regular sm:pt-[10px] sm:pb-[12px] size before:!hidden'>
                                <div className='w-full mb-[10px] hidden sm:block'>
                                    <div className="skeletonBox w-[60%]" />
                                </div>
                                <div className="skeletonBox w-[80%] sm:w-[95%]" />
                            </div>
                            <div className='attachments__cell flex flex-wrap items-center w-[60px] pt-[12px] pb-[10px] toggle__btn before:!hidden'>
                                <div className='w-full mb-[10px] hidden sm:block'>
                                    <div className="skeletonBox w-[60%]" />
                                </div>
                                <div className="skeletonBox w-[80%] sm:w-[95%]" />
                            </div>
                        </div>
                        <div className='attachments__row flex flex-wrap'>
                            <div className='attachments__cell w-[calc(25%_-_15px)] px-[20px] pt-[12px] pb-[10px] sm:pt-[8px] sm:pb-[9px] file__name !pr-[20px] before:!hidden'>
                                <div className='skeletonBox w-[60%] mb-[10px] hidden sm:block' />
                                <div className='w-full flex flex-wrap items-center'>
                                    <div className="skeletonBox w-[26px] h-[26px] rounded-[8px] mr-[10px]" />
                                    <div className="skeletonBox w-[calc(100%_-_36px)]" />
                                </div>
                            </div>
                            <div className='attachments__cell flex flex-wrap items-center w-[calc(25%_-_15px)] px-[20px] pt-[12px] pb-[10px] text-[16px] font-biotif__Regular sm:pt-[10px] sm:pb-[12px] attached__by before:!hidden'>
                                <div className='w-full mb-[10px] hidden sm:block'>
                                    <div className="skeletonBox w-[60%]" />
                                </div>
                                <div className="skeletonBox w-[80%] sm:w-[95%]" />
                            </div>
                            <div className='attachments__cell flex flex-wrap items-center w-[calc(25%_-_15px)] px-[20px] pt-[12px] pb-[10px] text-[16px] font-biotif__Regular sm:pt-[10px] sm:pb-[12px] date before:!hidden'>
                                <div className='w-full mb-[10px] hidden sm:block'>
                                    <div className="skeletonBox w-[60%]" />
                                </div>
                                <div className="skeletonBox w-[80%] sm:w-[95%]" />
                            </div>
                            <div className='attachments__cell flex flex-wrap items-center w-[calc(25%_-_15px)] px-[20px] pt-[12px] pb-[10px] text-[16px] font-biotif__Regular sm:pt-[10px] sm:pb-[12px] size before:!hidden'>
                                <div className='w-full mb-[10px] hidden sm:block'>
                                    <div className="skeletonBox w-[60%]" />
                                </div>
                                <div className="skeletonBox w-[80%] sm:w-[95%]" />
                            </div>
                            <div className='attachments__cell flex flex-wrap items-center w-[60px] pt-[12px] pb-[10px] toggle__btn before:!hidden'>
                                <div className='w-full mb-[10px] hidden sm:block'>
                                    <div className="skeletonBox w-[60%]" />
                                </div>
                                <div className="skeletonBox w-[80%] sm:w-[95%]" />
                            </div>
                        </div>
                        <div className='attachments__row flex flex-wrap'>
                            <div className='attachments__cell w-[calc(25%_-_15px)] px-[20px] pt-[12px] pb-[10px] sm:pt-[8px] sm:pb-[9px] file__name !pr-[20px] before:!hidden'>
                                <div className='skeletonBox w-[60%] mb-[10px] hidden sm:block' />
                                <div className='w-full flex flex-wrap items-center'>
                                    <div className="skeletonBox w-[26px] h-[26px] rounded-[8px] mr-[10px]" />
                                    <div className="skeletonBox w-[calc(100%_-_36px)]" />
                                </div>
                            </div>
                            <div className='attachments__cell flex flex-wrap items-center w-[calc(25%_-_15px)] px-[20px] pt-[12px] pb-[10px] text-[16px] font-biotif__Regular sm:pt-[10px] sm:pb-[12px] attached__by before:!hidden'>
                                <div className='w-full mb-[10px] hidden sm:block'>
                                    <div className="skeletonBox w-[60%]" />
                                </div>
                                <div className="skeletonBox w-[80%] sm:w-[95%]" />
                            </div>
                            <div className='attachments__cell flex flex-wrap items-center w-[calc(25%_-_15px)] px-[20px] pt-[12px] pb-[10px] text-[16px] font-biotif__Regular sm:pt-[10px] sm:pb-[12px] date before:!hidden'>
                                <div className='w-full mb-[10px] hidden sm:block'>
                                    <div className="skeletonBox w-[60%]" />
                                </div>
                                <div className="skeletonBox w-[80%] sm:w-[95%]" />
                            </div>
                            <div className='attachments__cell flex flex-wrap items-center w-[calc(25%_-_15px)] px-[20px] pt-[12px] pb-[10px] text-[16px] font-biotif__Regular sm:pt-[10px] sm:pb-[12px] size before:!hidden'>
                                <div className='w-full mb-[10px] hidden sm:block'>
                                    <div className="skeletonBox w-[60%]" />
                                </div>
                                <div className="skeletonBox w-[80%] sm:w-[95%]" />
                            </div>
                            <div className='attachments__cell flex flex-wrap items-center w-[60px] pt-[12px] pb-[10px] toggle__btn before:!hidden'>
                                <div className='w-full mb-[10px] hidden sm:block'>
                                    <div className="skeletonBox w-[60%]" />
                                </div>
                                <div className="skeletonBox w-[80%] sm:w-[95%]" />
                            </div>
                        </div>
                        <div className='attachments__row flex flex-wrap'>
                            <div className='attachments__cell w-[calc(25%_-_15px)] px-[20px] pt-[12px] pb-[10px] sm:pt-[8px] sm:pb-[9px] file__name !pr-[20px] before:!hidden'>
                                <div className='skeletonBox w-[60%] mb-[10px] hidden sm:block' />
                                <div className='w-full flex flex-wrap items-center'>
                                    <div className="skeletonBox w-[26px] h-[26px] rounded-[8px] mr-[10px]" />
                                    <div className="skeletonBox w-[calc(100%_-_36px)]" />
                                </div>
                            </div>
                            <div className='attachments__cell flex flex-wrap items-center w-[calc(25%_-_15px)] px-[20px] pt-[12px] pb-[10px] text-[16px] font-biotif__Regular sm:pt-[10px] sm:pb-[12px] attached__by before:!hidden'>
                                <div className='w-full mb-[10px] hidden sm:block'>
                                    <div className="skeletonBox w-[60%]" />
                                </div>
                                <div className="skeletonBox w-[80%] sm:w-[95%]" />
                            </div>
                            <div className='attachments__cell flex flex-wrap items-center w-[calc(25%_-_15px)] px-[20px] pt-[12px] pb-[10px] text-[16px] font-biotif__Regular sm:pt-[10px] sm:pb-[12px] date before:!hidden'>
                                <div className='w-full mb-[10px] hidden sm:block'>
                                    <div className="skeletonBox w-[60%]" />
                                </div>
                                <div className="skeletonBox w-[80%] sm:w-[95%]" />
                            </div>
                            <div className='attachments__cell flex flex-wrap items-center w-[calc(25%_-_15px)] px-[20px] pt-[12px] pb-[10px] text-[16px] font-biotif__Regular sm:pt-[10px] sm:pb-[12px] size before:!hidden'>
                                <div className='w-full mb-[10px] hidden sm:block'>
                                    <div className="skeletonBox w-[60%]" />
                                </div>
                                <div className="skeletonBox w-[80%] sm:w-[95%]" />
                            </div>
                            <div className='attachments__cell flex flex-wrap items-center w-[60px] pt-[12px] pb-[10px] toggle__btn before:!hidden'>
                                <div className='w-full mb-[10px] hidden sm:block'>
                                    <div className="skeletonBox w-[60%]" />
                                </div>
                                <div className="skeletonBox w-[80%] sm:w-[95%]" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}


export const SingleAttachmentSkeleton = () => {
    return (
        <div className='attachments__body py-[10px]'>
            <div className='attachments__row flex flex-wrap'>
                <div className='attachments__cell w-[calc(25%_-_15px)] px-[20px] pt-[12px] pb-[10px] sm:pt-[8px] sm:pb-[9px] file__name !pr-[20px] before:!hidden'>
                    <div className='skeletonBox w-[60%] mb-[10px] hidden sm:block' />
                    <div className='w-full flex flex-wrap items-center'>
                        <div className="skeletonBox w-[26px] h-[26px] rounded-[8px] mr-[10px]" />
                        <div className="skeletonBox w-[calc(100%_-_36px)]" />
                    </div>
                </div>
                <div className='attachments__cell flex flex-wrap items-center w-[calc(25%_-_15px)] px-[20px] pt-[12px] pb-[10px] text-[16px] font-biotif__Regular sm:pt-[10px] sm:pb-[12px] attached__by before:!hidden'>
                    <div className='w-full mb-[10px] hidden sm:block'>
                        <div className="skeletonBox w-[60%]" />
                    </div>
                    <div className="skeletonBox w-[80%] sm:w-[95%]" />
                </div>
                <div className='attachments__cell flex flex-wrap items-center w-[calc(25%_-_15px)] px-[20px] pt-[12px] pb-[10px] text-[16px] font-biotif__Regular sm:pt-[10px] sm:pb-[12px] date before:!hidden'>
                    <div className='w-full mb-[10px] hidden sm:block'>
                        <div className="skeletonBox w-[60%]" />
                    </div>
                    <div className="skeletonBox w-[80%] sm:w-[95%]" />
                </div>
                <div className='attachments__cell flex flex-wrap items-center w-[calc(25%_-_15px)] px-[20px] pt-[12px] pb-[10px] text-[16px] font-biotif__Regular sm:pt-[10px] sm:pb-[12px] size before:!hidden'>
                    <div className='w-full mb-[10px] hidden sm:block'>
                        <div className="skeletonBox w-[60%]" />
                    </div>
                    <div className="skeletonBox w-[80%] sm:w-[95%]" />
                </div>
                <div className='attachments__cell flex flex-wrap items-center w-[60px] pt-[12px] pb-[10px] toggle__btn before:!hidden'>
                    <div className='w-full mb-[10px] hidden sm:block'>
                        <div className="skeletonBox w-[60%]" />
                    </div>
                    <div className="skeletonBox w-[80%] sm:w-[95%]" />
                </div>
            </div>
            <div className='attachments__row flex flex-wrap'>
                <div className='attachments__cell w-[calc(25%_-_15px)] px-[20px] pt-[12px] pb-[10px] sm:pt-[8px] sm:pb-[9px] file__name !pr-[20px] before:!hidden'>
                    <div className='skeletonBox w-[60%] mb-[10px] hidden sm:block' />
                    <div className='w-full flex flex-wrap items-center'>
                        <div className="skeletonBox w-[26px] h-[26px] rounded-[8px] mr-[10px]" />
                        <div className="skeletonBox w-[calc(100%_-_36px)]" />
                    </div>
                </div>
                <div className='attachments__cell flex flex-wrap items-center w-[calc(25%_-_15px)] px-[20px] pt-[12px] pb-[10px] text-[16px] font-biotif__Regular sm:pt-[10px] sm:pb-[12px] attached__by before:!hidden'>
                    <div className='w-full mb-[10px] hidden sm:block'>
                        <div className="skeletonBox w-[60%]" />
                    </div>
                    <div className="skeletonBox w-[80%] sm:w-[95%]" />
                </div>
                <div className='attachments__cell flex flex-wrap items-center w-[calc(25%_-_15px)] px-[20px] pt-[12px] pb-[10px] text-[16px] font-biotif__Regular sm:pt-[10px] sm:pb-[12px] date before:!hidden'>
                    <div className='w-full mb-[10px] hidden sm:block'>
                        <div className="skeletonBox w-[60%]" />
                    </div>
                    <div className="skeletonBox w-[80%] sm:w-[95%]" />
                </div>
                <div className='attachments__cell flex flex-wrap items-center w-[calc(25%_-_15px)] px-[20px] pt-[12px] pb-[10px] text-[16px] font-biotif__Regular sm:pt-[10px] sm:pb-[12px] size before:!hidden'>
                    <div className='w-full mb-[10px] hidden sm:block'>
                        <div className="skeletonBox w-[60%]" />
                    </div>
                    <div className="skeletonBox w-[80%] sm:w-[95%]" />
                </div>
                <div className='attachments__cell flex flex-wrap items-center w-[60px] pt-[12px] pb-[10px] toggle__btn before:!hidden'>
                    <div className='w-full mb-[10px] hidden sm:block'>
                        <div className="skeletonBox w-[60%]" />
                    </div>
                    <div className="skeletonBox w-[80%] sm:w-[95%]" />
                </div>
            </div>
            <div className='attachments__row flex flex-wrap'>
                <div className='attachments__cell w-[calc(25%_-_15px)] px-[20px] pt-[12px] pb-[10px] sm:pt-[8px] sm:pb-[9px] file__name !pr-[20px] before:!hidden'>
                    <div className='skeletonBox w-[60%] mb-[10px] hidden sm:block' />
                    <div className='w-full flex flex-wrap items-center'>
                        <div className="skeletonBox w-[26px] h-[26px] rounded-[8px] mr-[10px]" />
                        <div className="skeletonBox w-[calc(100%_-_36px)]" />
                    </div>
                </div>
                <div className='attachments__cell flex flex-wrap items-center w-[calc(25%_-_15px)] px-[20px] pt-[12px] pb-[10px] text-[16px] font-biotif__Regular sm:pt-[10px] sm:pb-[12px] attached__by before:!hidden'>
                    <div className='w-full mb-[10px] hidden sm:block'>
                        <div className="skeletonBox w-[60%]" />
                    </div>
                    <div className="skeletonBox w-[80%] sm:w-[95%]" />
                </div>
                <div className='attachments__cell flex flex-wrap items-center w-[calc(25%_-_15px)] px-[20px] pt-[12px] pb-[10px] text-[16px] font-biotif__Regular sm:pt-[10px] sm:pb-[12px] date before:!hidden'>
                    <div className='w-full mb-[10px] hidden sm:block'>
                        <div className="skeletonBox w-[60%]" />
                    </div>
                    <div className="skeletonBox w-[80%] sm:w-[95%]" />
                </div>
                <div className='attachments__cell flex flex-wrap items-center w-[calc(25%_-_15px)] px-[20px] pt-[12px] pb-[10px] text-[16px] font-biotif__Regular sm:pt-[10px] sm:pb-[12px] size before:!hidden'>
                    <div className='w-full mb-[10px] hidden sm:block'>
                        <div className="skeletonBox w-[60%]" />
                    </div>
                    <div className="skeletonBox w-[80%] sm:w-[95%]" />
                </div>
                <div className='attachments__cell flex flex-wrap items-center w-[60px] pt-[12px] pb-[10px] toggle__btn before:!hidden'>
                    <div className='w-full mb-[10px] hidden sm:block'>
                        <div className="skeletonBox w-[60%]" />
                    </div>
                    <div className="skeletonBox w-[80%] sm:w-[95%]" />
                </div>
            </div>
            <div className='attachments__row flex flex-wrap'>
                <div className='attachments__cell w-[calc(25%_-_15px)] px-[20px] pt-[12px] pb-[10px] sm:pt-[8px] sm:pb-[9px] file__name !pr-[20px] before:!hidden'>
                    <div className='skeletonBox w-[60%] mb-[10px] hidden sm:block' />
                    <div className='w-full flex flex-wrap items-center'>
                        <div className="skeletonBox w-[26px] h-[26px] rounded-[8px] mr-[10px]" />
                        <div className="skeletonBox w-[calc(100%_-_36px)]" />
                    </div>
                </div>
                <div className='attachments__cell flex flex-wrap items-center w-[calc(25%_-_15px)] px-[20px] pt-[12px] pb-[10px] text-[16px] font-biotif__Regular sm:pt-[10px] sm:pb-[12px] attached__by before:!hidden'>
                    <div className='w-full mb-[10px] hidden sm:block'>
                        <div className="skeletonBox w-[60%]" />
                    </div>
                    <div className="skeletonBox w-[80%] sm:w-[95%]" />
                </div>
                <div className='attachments__cell flex flex-wrap items-center w-[calc(25%_-_15px)] px-[20px] pt-[12px] pb-[10px] text-[16px] font-biotif__Regular sm:pt-[10px] sm:pb-[12px] date before:!hidden'>
                    <div className='w-full mb-[10px] hidden sm:block'>
                        <div className="skeletonBox w-[60%]" />
                    </div>
                    <div className="skeletonBox w-[80%] sm:w-[95%]" />
                </div>
                <div className='attachments__cell flex flex-wrap items-center w-[calc(25%_-_15px)] px-[20px] pt-[12px] pb-[10px] text-[16px] font-biotif__Regular sm:pt-[10px] sm:pb-[12px] size before:!hidden'>
                    <div className='w-full mb-[10px] hidden sm:block'>
                        <div className="skeletonBox w-[60%]" />
                    </div>
                    <div className="skeletonBox w-[80%] sm:w-[95%]" />
                </div>
                <div className='attachments__cell flex flex-wrap items-center w-[60px] pt-[12px] pb-[10px] toggle__btn before:!hidden'>
                    <div className='w-full mb-[10px] hidden sm:block'>
                        <div className="skeletonBox w-[60%]" />
                    </div>
                    <div className="skeletonBox w-[80%] sm:w-[95%]" />
                </div>
            </div>
           
        </div>
    )
}
