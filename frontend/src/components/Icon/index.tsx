// =================== import packages ==================
import { SVGAttributes } from 'react';
// ======================================================
import { ReactComponent as BackBtnFilled } from 'assets/images/icons/filled-icons/backBtnFilledIcon.svg';
import { ReactComponent as CalendarFilled } from 'assets/images/icons/filled-icons/calendarFilledIcon.svg';
import { ReactComponent as CommentFilled } from 'assets/images/icons/filled-icons/commentFilledIcon.svg';
import { ReactComponent as DashboardFilled } from 'assets/images/icons/filled-icons/dashboardFilledIcon.svg';
import { ReactComponent as DeleteFilled } from 'assets/images/icons/filled-icons/deleteFilledIcon.svg';
import { ReactComponent as EditFilled } from 'assets/images/icons/filled-icons/editFilledIcon.svg';
import { ReactComponent as PermissionEditFilled } from 'assets/images/icons/filled-icons/permissionEditFilledIcon.svg';
import { ReactComponent as EyeFilled } from 'assets/images/icons/filled-icons/eyeFilledIcon.svg';
import { ReactComponent as EyeHideFilled } from 'assets/images/icons/filled-icons/eyeHideFilledIcon.svg';
import { ReactComponent as FacebookFilled } from 'assets/images/icons/filled-icons/facebookFilledIcon.svg';
import { ReactComponent as FilterFilled } from 'assets/images/icons/filled-icons/filterFilledIcon.svg';
import { ReactComponent as GraphFilled } from 'assets/images/icons/filled-icons/graphFilledIcon.svg';
import { ReactComponent as HomeFilled } from 'assets/images/icons/filled-icons/homeFilledIcon.svg';
import { ReactComponent as InfoFilled } from 'assets/images/icons/filled-icons/infoFilledIcon.svg';
import { ReactComponent as MailFilled } from 'assets/images/icons/filled-icons/mailFilledIcon.svg';
import { ReactComponent as MarkAsUnreadFilled } from 'assets/images/icons/filled-icons/markAsUnreadFilledIcon.svg';
import { ReactComponent as MobileMenuFilled } from 'assets/images/icons/filled-icons/mobileMenuFilledIcon.svg';
import { ReactComponent as NotificationFilled } from 'assets/images/icons/filled-icons/notificationFilledIcon.svg';
import { ReactComponent as OptionFilled } from 'assets/images/icons/filled-icons/optionFilledIcon.svg';
import { ReactComponent as PhoneFilled } from 'assets/images/icons/filled-icons/phoneFilledIcon.svg';
import { ReactComponent as PlusFilled } from 'assets/images/icons/filled-icons/plusFilledIcon.svg';
import { ReactComponent as PlusFilledWhiteBGIcon } from 'assets/images/icons/filled-icons/plusFilledWhiteBGIcon.svg';
import { ReactComponent as PlusFilledBlueIcon } from 'assets/images/icons/filled-icons/plusFilledBlueIcon.svg';
import { ReactComponent as SecurityFilled } from 'assets/images/icons/filled-icons/securityFilledIcon.svg';
import { ReactComponent as SettingFilled } from 'assets/images/icons/filled-icons/settingFilledIcon.svg';
import { ReactComponent as SignupBackArrowFilled } from 'assets/images/icons/filled-icons/signupBackArrowFilledIcon.svg';
import { ReactComponent as TwitterFilled } from 'assets/images/icons/filled-icons/twitterFilledIcon.svg';
import { ReactComponent as WatchFilled } from 'assets/images/icons/filled-icons/watchFilledIcon.svg';
import { ReactComponent as WatchSquareFilled } from 'assets/images/icons/filled-icons/watchSquareFilledIcon.svg';
import { ReactComponent as AddBtnFilled } from 'assets/images/icons/filled-icons/addBtnFilledIcon.svg';
import { ReactComponent as CloseBtnFilled } from 'assets/images/icons/filled-icons/closeBtnFilledIcon.svg';
import { ReactComponent as CommentFilledBlueIcon } from 'assets/images/icons/filled-icons/commentFilledBlueIcon.svg';
import { ReactComponent as MailFilledOrangeIcon } from 'assets/images/icons/filled-icons/mailFilledOrangeIcon.svg';
import { ReactComponent as PhoneFilledGreenIcon } from 'assets/images/icons/filled-icons/phoneFilledGreenIcon.svg';
import { ReactComponent as CalendarFilledBlueIcon } from 'assets/images/icons/filled-icons/calendarFilledBlueIcon.svg';
import { ReactComponent as AccountFilledBlueIcon } from 'assets/images/icons/filled-icons/accountFilledBlueIcon.svg';
import { ReactComponent as ActivitiesFilledBlueIcon } from 'assets/images/icons/filled-icons/activitiesFilledBlueIcon.svg';
import { ReactComponent as ActivitiesFilledBlackIcon } from 'assets/images/icons/filled-icons/activitiesFilledBlackIcon.svg';
import { ReactComponent as ContactFilledBlueIcon } from 'assets/images/icons/filled-icons/contactFilledBlueIcon.svg';
import { ReactComponent as DashboardFilledBlueIcon } from 'assets/images/icons/filled-icons/dashboardFilledBlueIcon.svg';
import { ReactComponent as DealsFilledBlueIcon } from 'assets/images/icons/filled-icons/dealsFilledBlueIcon.svg';
import { ReactComponent as EmailFilledBlueIcon } from 'assets/images/icons/filled-icons/emailFilledBlueIcon.svg';
import { ReactComponent as LeadsFilledBlueIcon } from 'assets/images/icons/filled-icons/leadsFilledBlueIcon.svg';
import { ReactComponent as LogoutFilledBlueIcon } from 'assets/images/icons/filled-icons/logoutFilledBlueIcon.svg';
import { ReactComponent as ProfileFilledBlueIcon } from 'assets/images/icons/filled-icons/profileFilledBlueIcon.svg';
import { ReactComponent as SearchFilledBlueIcon } from 'assets/images/icons/filled-icons/searchFilledBlueIcon.svg';
import { ReactComponent as SettingFilledBlueIcon } from 'assets/images/icons/filled-icons/settingFilledBlueIcon.svg';
import { ReactComponent as MinusFilledBlueIcon } from 'assets/images/icons/filled-icons/minusFilledBlueIcon.svg';
import { ReactComponent as PhoneFilledBlueIcon } from 'assets/images/icons/filled-icons/phoneFilledBlueIcon.svg';
import { ReactComponent as Toggle3dotsIcon } from 'assets/images/icons/filled-icons/toggle3dots_icon.svg';
import { ReactComponent as ProfileFilledIconGrey } from 'assets/images/icons/filled-icons/profileFilledIconGrey.svg';
import { ReactComponent as CurrencyFilledIcon } from 'assets/images/icons/filled-icons/currencyFilledIcon.svg';
import { ReactComponent as AttachmentFilledIcon } from 'assets/images/icons/filled-icons/attachmentFilledIcon.svg';
import { ReactComponent as OfferTagsFilledIcon } from 'assets/images/icons/filled-icons/offerTagsFilledIcon.svg';
import { ReactComponent as Dots3HorizontalFilledIcon } from 'assets/images/icons/filled-icons/dots3HorizontalFilledIcon.svg';
import { ReactComponent as UploadFileFilledIcon } from 'assets/images/icons/filled-icons/uploadFileFilledIcon.svg';
import { ReactComponent as ImageIconFilledPrimaryColor } from 'assets/images/icons/filled-icons/imageIconFilledPrimaryColor.svg';
import { ReactComponent as ImageIconFilledBlack } from 'assets/images/icons/filled-icons/imageIconFilledBlack.svg';
import { ReactComponent as FileIconFilledPrimaryColor } from 'assets/images/icons/filled-icons/fileIconFilledPrimaryColor.svg';
import { ReactComponent as VideoIconFilledPrimaryColor } from 'assets/images/icons/filled-icons/videoIconFilledPrimaryColor.svg';
import { ReactComponent as AudioIconFilledPrimaryColor } from 'assets/images/icons/filled-icons/audioIconFilledPrimaryColor.svg';
import { ReactComponent as LinkIconFilledPrimaryColor } from 'assets/images/icons/filled-icons/linkIconFilledPrimaryColor.svg';
import { ReactComponent as CreatedItemIconFilled } from 'assets/images/icons/filled-icons/createdItemIconFilled.svg';
import { ReactComponent as DealValueFilledIcon } from 'assets/images/icons/filled-icons/dealValueFilledIcon.svg';
import { ReactComponent as ClosingDateFilledIcon } from 'assets/images/icons/filled-icons/closingDateFilledIcon.svg';
import { ReactComponent as UserProfileFilledIcon } from 'assets/images/icons/filled-icons/userProfileFilledIcon.svg';
import { ReactComponent as TaskFilledIcon } from 'assets/images/icons/filled-icons/taskFilledIcon.svg';
import { ReactComponent as MeetingFilledIcon } from 'assets/images/icons/filled-icons/meetingFilledIcon.svg';
import { ReactComponent as SmsFilledIcon } from 'assets/images/icons/filled-icons/smsFilledIcon.svg';
import { ReactComponent as CopyFilledIcon } from 'assets/images/icons/filled-icons/copyFilledIcon.svg';
import { ReactComponent as DownloadFilledIocn } from 'assets/images/icons/filled-icons/downloadFilledIocn.svg';
import { ReactComponent as UpdateFilledIcon } from 'assets/images/icons/filled-icons/updateFilledIcon.svg';
import { ReactComponent as LunchFilledIcon } from 'assets/images/icons/filled-icons/lunchFilledIcon.svg';
import { ReactComponent as DeadlineFilledIcon } from 'assets/images/icons/filled-icons/deadlineFilledIcon.svg';
import { ReactComponent as FollowupFilledIcon } from 'assets/images/icons/filled-icons/followupFilledIcon.svg';
import { ReactComponent as CampaingFilledIcon } from 'assets/images/icons/filled-icons/campaingFilledIcon.svg';
import { ReactComponent as ReminderFilledIcon } from 'assets/images/icons/filled-icons/reminderFilledIcon.svg';
import { ReactComponent as ChatFilledIcon } from 'assets/images/icons/filled-icons/chatFilledIcon.svg';
import { ReactComponent as InpersonmeetingFilledIcon } from 'assets/images/icons/filled-icons/inpersonmeetingFilledIcon.svg';
import { ReactComponent as ColdcallingFilledIcon } from 'assets/images/icons/filled-icons/coldcallingFilledIcon.svg';
import { ReactComponent as NegotiationFilledIcon } from 'assets/images/icons/filled-icons/negotiationFilledIcon.svg';
import { ReactComponent as PromotionaleventsFilledIcon } from 'assets/images/icons/filled-icons/promotionaleventsFilledIcon.svg';
import { ReactComponent as UpsellingFilledIcon } from 'assets/images/icons/filled-icons/upsellingFilledIcon.svg';
import { ReactComponent as ManagepaymentFilledIcon } from 'assets/images/icons/filled-icons/managepaymentFilledIcon.svg';
import { ReactComponent as ManageincidentFilledIcon } from 'assets/images/icons/filled-icons/manageincidentFilledIcon.svg';
import { ReactComponent as CostomerresearchFilledIcon } from 'assets/images/icons/filled-icons/costomerresearchFilledIcon.svg';
import { ReactComponent as MargincalculateFilledIcon } from 'assets/images/icons/filled-icons/margincalculateFilledIcon.svg';
import { ReactComponent as PublicspeechFilledIcon } from 'assets/images/icons/filled-icons/publicspeechFilledIcon.svg';
import { ReactComponent as ContractdraftingFilledIcon } from 'assets/images/icons/filled-icons/contractdraftingFilledIcon.svg';
import { ReactComponent as ProducttrainingFilledIcon } from 'assets/images/icons/filled-icons/producttrainingFilledIcon.svg';
import { ReactComponent as DatacaptureFilledIcon } from 'assets/images/icons/filled-icons/datacaptureFilledIcon.svg';
import { ReactComponent as FeedbacksurveyFilledIcon } from 'assets/images/icons/filled-icons/feedbacksurveyFilledIcon.svg';
import { ReactComponent as CroossellingFilledIon } from 'assets/images/icons/filled-icons/croossellingFilledIon.svg';
import { ReactComponent as ProductdemonstrationFilledIcon } from 'assets/images/icons/filled-icons/productdemonstrationFilledIcon.svg';
import { ReactComponent as ProofofconceptFilledIcon } from 'assets/images/icons/filled-icons/proofofconceptFilledIcon.svg';
import { ReactComponent as SolutiondesignFilledIcon } from 'assets/images/icons/filled-icons/solutiondesignFilledIcon.svg';
import { ReactComponent as NeedanalyticsFilledIcon } from 'assets/images/icons/filled-icons/needanalyticsFilledIcon.svg';
import { ReactComponent as CompetitiveanalysisFilledIcon } from 'assets/images/icons/filled-icons/competitiveanalysisFilledIcon.svg';
import { ReactComponent as AssignmemberFilledIcon } from 'assets/images/icons/filled-icons/assignmemberFilledIcon.svg';
import { ReactComponent as TeaFilledIcon } from 'assets/images/icons/filled-icons/teaFilledIcon.svg';
import { ReactComponent as CreatteamFilledIcon } from 'assets/images/icons/filled-icons/creatteamFilledIcon.svg';
import { ReactComponent as BuildingFilledIcon } from 'assets/images/icons/filled-icons/buildingFilledIcon.svg';
import { ReactComponent as CurrancyFilledIcon } from 'assets/images/icons/filled-icons/currancyFilledIcon.svg';
import { ReactComponent as LocationFilledIcon } from 'assets/images/icons/filled-icons/locationFilledIcon.svg';
import { ReactComponent as LockFilledIcon } from 'assets/images/icons/filled-icons/lockFilledIcon.svg';
import { ReactComponent as ComposeMailUploadFileFilledIcon } from 'assets/images/icons/filled-icons/composeMailUploadFileFilledIcon.svg';
import { ReactComponent as ComposeMailDriveFilledIcon } from 'assets/images/icons/filled-icons/composeMailDriveFilledIcon.svg';
import { ReactComponent as ComposeMailEditFilledIcon } from 'assets/images/icons/filled-icons/composeMailEditFilledIcon.svg';
import { ReactComponent as ComposeMailEmojiFilledIcon } from 'assets/images/icons/filled-icons/composeMailEmojiFilledIcon.svg';
import { ReactComponent as ComposeMailImgFilledIcon } from 'assets/images/icons/filled-icons/composeMailImgFilledIcon.svg';
import { ReactComponent as ComposeMailLinkFilledIcon } from 'assets/images/icons/filled-icons/composeMailLinkFilledIcon.svg';
import { ReactComponent as ComposeMailLocktimeFilledIcon } from 'assets/images/icons/filled-icons/composeMailLocktimeFilledIcon.svg';
import { ReactComponent as ComposeMailAlphabetFilledIcon } from 'assets/images/icons/filled-icons/composeMailAlphabetFilledIcon.svg';
import { ReactComponent as ResetFilledIcon } from 'assets/images/icons/filled-icons/resetFilledIcon.svg';
import { ReactComponent as SpamMailFilledIcon } from 'assets/images/icons/filled-icons/spamMailFilledIcon.svg';
import { ReactComponent as DraftMailFilledIcon } from 'assets/images/icons/filled-icons/draftMailFilledIcon.svg';
import { ReactComponent as InboxViewBackFilledIcon } from 'assets/images/icons/filled-icons/inboxViewBackFilledIcon.svg';
import { ReactComponent as InboxViewDeleteFilledIcon } from 'assets/images/icons/filled-icons/inboxViewDeleteFilledIcon.svg';
import { ReactComponent as InboxViewDraftFilledIcon } from 'assets/images/icons/filled-icons/inboxViewDraftFilledIcon.svg';
import { ReactComponent as InboxViewEmailFilledIcon } from 'assets/images/icons/filled-icons/inboxViewEmailFilledIcon.svg';
import { ReactComponent as InboxViewForwardFilledIcon } from 'assets/images/icons/filled-icons/inboxViewForwardFilledIcon.svg';
import { ReactComponent as InboxViewNextFilledIcon } from 'assets/images/icons/filled-icons/inboxViewNextFilledIcon.svg';
import { ReactComponent as InboxViewPrevFilledIcon } from 'assets/images/icons/filled-icons/inboxViewPrevFilledIcon.svg';
import { ReactComponent as InboxViewBookmarkFilledIcon } from 'assets/images/icons/filled-icons/inboxViewBookmarkFilledIcon.svg';
import { ReactComponent as InboxViewPrintFilledIcon } from 'assets/images/icons/filled-icons/inboxViewPrintFilledIcon.svg';
import { ReactComponent as InboxViewReplyFilledIcon } from 'assets/images/icons/filled-icons/inboxViewReplyFilledIcon.svg';
import { ReactComponent as InboxViewShareFilledIcon } from 'assets/images/icons/filled-icons/inboxViewShareFilledIcon.svg';
import { ReactComponent as InboxViewThreedotsFilledIcon } from 'assets/images/icons/filled-icons/inboxViewThreedotsFilledIcon.svg';
import { ReactComponent as InboxViewForwardBlueArrowFilled } from 'assets/images/icons/filled-icons/inboxViewForwardBlueArrowFilled.svg';
import { ReactComponent as InboxViewReplyAllBlueArrowFilled } from 'assets/images/icons/filled-icons/inboxViewReplyAllBlueArrowFilled.svg';
import { ReactComponent as InboxViewReplyBlueArrowFilled } from 'assets/images/icons/filled-icons/inboxViewReplyBlueArrowFilled.svg';
import { ReactComponent as GreenRightTickFilledIcon } from 'assets/images/icons/filled-icons/greenRightTickFilledIcon.svg';
import { ReactComponent as CopyStrokeIcon } from 'assets/images/icons/filled-icons/copyStrokeIcon.svg';
import { ReactComponent as EditPencilFilledIcon } from 'assets/images/icons/filled-icons/editPencilFilledIcon.svg';
import { ReactComponent as UnlockFilledIcon } from 'assets/images/icons/filled-icons/unlockFilledIcon.svg';
import { ReactComponent as VoipVoiceFilledBtn } from 'assets/images/icons/filled-icons/voipVoiceFilledBtn.svg';
import { ReactComponent as VoipKeypadFilledBtn } from 'assets/images/icons/filled-icons/voipKeypadFilledBtn.svg';
import { ReactComponent as VoipMuteFilledBtn } from 'assets/images/icons/filled-icons/voipMuteFilledBtn.svg';
import { ReactComponent as VoipUnmuteFilledBtn } from 'assets/images/icons/filled-icons/voipUnmuteFilledBtn.svg';
import { ReactComponent as VoipPaushFilledBtn } from 'assets/images/icons/filled-icons/voipPaushFilledBtn.svg';
import { ReactComponent as VoipRecordFilledBtn } from 'assets/images/icons/filled-icons/voipRecordFilledBtn.svg';
import { ReactComponent as DealLoseFilledIcon } from 'assets/images/icons/filled-icons/dealLoseFilledIcon.svg';
import { ReactComponent as DealWonFilledIcon } from 'assets/images/icons/filled-icons/dealWonFilledIcon.svg';
import { ReactComponent as DueFilledIcon } from 'assets/images/icons/filled-icons/dueFilledIcon.svg';
import { ReactComponent as StartFilledIcon } from 'assets/images/icons/filled-icons/startFilledIcon.svg';
import { ReactComponent as LinkLeadDealFilledIcon } from 'assets/images/icons/filled-icons/linkLeadDealFilledIcon.svg';
import { ReactComponent as TimlineMessageIcon } from 'assets/images/icons/filled-icons/timlineMessageIcon.svg';
import { ReactComponent as TimelinePinIcon } from 'assets/images/icons/filled-icons/timelinePinIcon.svg';
import { ReactComponent as TimelineEmojiIcon } from 'assets/images/icons/filled-icons/timelineEmojiIcon.svg';
import { ReactComponent as TimelineDocumentDownloadIcon } from 'assets/images/icons/filled-icons/timelineDocumentDownloadIcon.svg';
import { ReactComponent as TimelineDocunetCrossIcon } from 'assets/images/icons/filled-icons/timelineDocunetCrossIcon.svg';
import { ReactComponent as ContactCreatedFilledIcon } from 'assets/images/icons/filled-icons/contactCreatedFilledIcon.svg';
import { ReactComponent as ContactOwnerFilledIcon } from 'assets/images/icons/filled-icons/contactOwnerFilledIcon.svg';
import { ReactComponent as DocumentFilledIcon } from 'assets/images/icons/filled-icons/documentFilledIcon.svg';
import { ReactComponent as NameChangeFilledIcon } from 'assets/images/icons/filled-icons/nameChangeFilledIcon.svg';
import { ReactComponent as CorruptImgFilledIcon } from 'assets/images/icons/filled-icons/corruptImgFilledIcon.svg';
import { ReactComponent as AttachmentIcon } from 'assets/images/icons/filled-icons/attachmentIcon.svg';
import { ReactComponent as SnippetIcon } from 'assets/images/icons/filled-icons/snippetIcon.svg';
import { ReactComponent as StreamFilledIcon } from 'assets/images/icons/filled-icons/streamFilledIcon.svg';
import { ReactComponent as PinFilledIcon } from 'assets/images/icons/filled-icons/pinFilledIcon.svg';
import { ReactComponent as UnpinFilledIcon } from 'assets/images/icons/filled-icons/unpinFilledIcon.svg';
import { ReactComponent as ActivityLaunchIcon } from 'assets/images/icons/filled-icons/activityLaunchIcon.svg';
import { ReactComponent as WonLostIcon } from 'assets/images/icons/filled-icons/wonLostIcon.svg';
import { ReactComponent as ConvertLeadIcon } from 'assets/images/icons/filled-icons/convertLeadIcon.svg';
import { ReactComponent as StartStopIcon } from 'assets/images/icons/filled-icons/startStopIcon.svg';
import { ReactComponent as MarkAsDoneIcon } from 'assets/images/icons/filled-icons/markAsDoneIcon.svg';

import { ReactComponent as CalendarStroke } from 'assets/images/icons/stroke-icons/calendarStrokeIcon.svg';
import { ReactComponent as CommentStroke } from 'assets/images/icons/stroke-icons/commentStrokeIcon.svg';
import { ReactComponent as DashboardStroke } from 'assets/images/icons/stroke-icons/dashboardStrokeIcon.svg';
import { ReactComponent as DeleteStroke } from 'assets/images/icons/stroke-icons/deleteStrokeIcon.svg';
import { ReactComponent as EditStroke } from 'assets/images/icons/stroke-icons/editStrokeIcon.svg';
import { ReactComponent as EyeStroke } from 'assets/images/icons/stroke-icons/eyeStrokeIcon.svg';
import { ReactComponent as EyeHideStroke } from 'assets/images/icons/stroke-icons/eyeHideStrokeIcon.svg';
import { ReactComponent as FacebookStroke } from 'assets/images/icons/stroke-icons/facebookStrokeIcon.svg';
import { ReactComponent as FilterStroke } from 'assets/images/icons/stroke-icons/filterStrokeIcon.svg';
import { ReactComponent as GraphStroke } from 'assets/images/icons/stroke-icons/graphStrokeIcon.svg';
import { ReactComponent as HomeStroke } from 'assets/images/icons/stroke-icons/homeStrokeIcon.svg';
import { ReactComponent as InfoStroke } from 'assets/images/icons/stroke-icons/infoStrokeIcon.svg';
import { ReactComponent as MailStroke } from 'assets/images/icons/stroke-icons/mailStrokeIcon.svg';
import { ReactComponent as MobileMenuStroke } from 'assets/images/icons/stroke-icons/mobileMenuStrokeIcon.svg';
import { ReactComponent as NotificationStroke } from 'assets/images/icons/stroke-icons/notificationStrokeIcon.svg';
import { ReactComponent as PhoneStroke } from 'assets/images/icons/stroke-icons/phoneStrokeIcon.svg';
import { ReactComponent as SecurityStroke } from 'assets/images/icons/stroke-icons/securityStrokeIcon.svg';
import { ReactComponent as SettingStroke } from 'assets/images/icons/stroke-icons/settingStrokeIcon.svg';
import { ReactComponent as TwitterStroke } from 'assets/images/icons/stroke-icons/twitterStrokeIcon.svg';
import { ReactComponent as WatchStroke } from 'assets/images/icons/stroke-icons/watchStrokeIcon.svg';
import { ReactComponent as WatchSquareStroke } from 'assets/images/icons/stroke-icons/watchSquareStrokeIcon.svg';
import { ReactComponent as SearchStrokeIcon } from 'assets/images/icons/stroke-icons/searchStrokeIcon.svg';
import { ReactComponent as ListViewStrokeIcon } from 'assets/images/icons/stroke-icons/listViewStrokeIcon.svg';
import { ReactComponent as KanbanViewStrokeIcon } from 'assets/images/icons/stroke-icons/kanbanViewStrokeIcon.svg';
import { ReactComponent as InformationIcon } from 'assets/images/icons/filled-icons/information-icon.svg';
import { ReactComponent as AlertIcon } from 'assets/images/icons/filled-icons/alertIcon.svg';
import { ReactComponent as LaptopStrokeIcon } from 'assets/images/icons/stroke-icons/laptopStrokeIcon.svg';
import { ReactComponent as MobileStrokeIcon } from 'assets/images/icons/stroke-icons/mobileStrokeIcon.svg';
import { ReactComponent as TabletStrokeIcon } from 'assets/images/icons/stroke-icons/tabletStrokeIcon.svg';
import { ReactComponent as LocationStrokeIcon } from 'assets/images/icons/stroke-icons/locationStrokeIcon.svg';
import { ReactComponent as FilterIcon } from 'assets/images/icons/filled-icons/filterIcon.svg';
import { ReactComponent as GroupIcon } from 'assets/images/icons/filled-icons/groupIcon.svg';
import { ReactComponent as SortIcon } from 'assets/images/icons/filled-icons/sortIcon.svg';
import { ReactComponent as ColumnIcon } from 'assets/images/icons/filled-icons/columnIcon.svg';
import { ReactComponent as ClockStrokeIcon } from 'assets/images/icons/stroke-icons/clockStrokeIcon.svg';
import { ReactComponent as MoveShareIcon } from 'assets/images/icons/filled-icons/moveShareIcon.svg';
import { ReactComponent as RolePremissionIcon } from 'assets/images/icons/filled-icons/rolePremissionIcon.svg';
import { ReactComponent as DottedClockIcon } from 'assets/images/icons/new-icons/dottedClockIcon.svg';
import { ReactComponent as EmojiIcon } from 'assets/images/icons/new-icons/emojiIcon.svg';
import { ReactComponent as GroupNewIcon } from 'assets/images/icons/new-icons/groupIcon.svg';
import { ReactComponent as LocationIcon } from 'assets/images/icons/new-icons/locationIcon.svg';
import { ReactComponent as NoteIcon } from 'assets/images/icons/new-icons/noteIcon.svg';
import { ReactComponent as NotificationIcon } from 'assets/images/icons/new-icons/notificationIcon.svg';
import { ReactComponent as VideoIcon } from 'assets/images/icons/new-icons/videoIcon.svg';
import { ReactComponent as ViewIcon } from 'assets/images/icons/new-icons/viewIcon.svg';
import { ReactComponent as VideoPlayBtn } from 'assets/images/icons/new-icons/videoPlayBtn.svg';
import { ReactComponent as VideoPaushIcon } from 'assets/images/icons/new-icons/videoPaushIcon.svg';
import { ReactComponent as EmailNewIcon } from 'assets/images/icons/new-icons/emailNewIcon.svg';
import { ReactComponent as NoteNewIcon } from 'assets/images/icons/new-icons/noteNewIcon.svg';
import { ReactComponent as WrapIcon } from 'assets/images/icons/filled-icons/wrapIcon.svg';
import { ReactComponent as UnWrapIcon } from 'assets/images/icons/filled-icons/unwrapIcon.svg';
import { ReactComponent as LineHeight40Icon } from 'assets/images/icons/filled-icons/lineHeight40Icon.svg';
import { ReactComponent as LineHeight60Icon } from 'assets/images/icons/filled-icons/lineHeight60Icon.svg';
import { ReactComponent as LineHeight70Icon } from 'assets/images/icons/filled-icons/lineHeight70Icon.svg';
import { ReactComponent as PublicIcon } from 'assets/images/icons/filled-icons/publicFilledIcon.svg';
import { ReactComponent as PrivateIcon } from 'assets/images/icons/filled-icons/privateFilledIcon.svg';

export type IconTypes =
  | 'backBtnFilled'
  | 'calendarFilled'
  | 'commentFilled'
  | 'dashboardFilled'
  | 'deleteFilled'
  | 'editFilled'
  | 'permissionEditFilled'
  | 'eyeFilled'
  | 'eyeHideFilled'
  | 'facebookFilled'
  | 'filterFilled'
  | 'graphFilled'
  | 'homeFilled'
  | 'infoFilled'
  | 'mailFilled'
  | 'markAsUnreadFilledIcon'
  | 'mobileMenuFilled'
  | 'notificationFilled'
  | 'optionFilled'
  | 'phoneFilled'
  | 'plusFilled'
  | 'plusFilledWhiteBGIcon'
  | 'plusFilledBlueIcon'
  | 'securityFilled'
  | 'settingFilled'
  | 'signupBackArrowFilled'
  | 'twitterFilled'
  | 'watchFilled'
  | 'watchSquareFilled'
  | 'addBtnFilled'
  | 'closeBtnFilled'
  | 'calendarStroke'
  | 'commentStroke'
  | 'dashboardStroke'
  | 'deleteStroke'
  | 'editStroke'
  | 'eyeStroke'
  | 'eyeHideStroke'
  | 'facebookStroke'
  | 'filterStroke'
  | 'graphStroke'
  | 'homeStroke'
  | 'infoStroke'
  | 'mailStroke'
  | 'mobileMenuStroke'
  | 'notificationStroke'
  | 'phoneStroke'
  | 'securityStroke'
  | 'settingStroke'
  | 'twitterStroke'
  | 'watchStroke'
  | 'watchSquareStroke'
  | 'commentFilledBlueIcon'
  | 'mailFilledOrangeIcon'
  | 'phoneFilledGreenIcon'
  | 'calendarFilledBlueIcon'
  | 'accountFilledBlueIcon'
  | 'activitiesFilledBlueIcon'
  | 'activitiesFilledBlackIcon'
  | 'contactFilledBlueIcon'
  | 'dashboardFilledBlueIcon'
  | 'dealsFilledBlueIcon'
  | 'emailFilledBlueIcon'
  | 'leadsFilledBlueIcon'
  | 'logoutFilledBlueIcon'
  | 'profileFilledBlueIcon'
  | 'searchFilledBlueIcon'
  | 'settingFilledBlueIcon'
  | 'minusFilledBlueIcon'
  | 'phoneFilledBlueIcon'
  | 'toggle3dotsIcon'
  | 'profileFilledIconGrey'
  | 'currencyFilledIcon'
  | 'attachmentFilledIcon'
  | 'offerTagsFilledIcon'
  | 'dots3HorizontalFilledIcon'
  | 'searchStrokeIcon'
  | 'uploadFileFilledIcon'
  | 'imageIconFilledPrimaryColor'
  | 'imageIconFilledBlack'
  | 'fileIconFilledPrimaryColor'
  | 'videoIconFilledPrimaryColor'
  | 'audioIconFilledPrimaryColor'
  | 'linkIconFilledPrimaryColor'
  | 'createdItemIconFilled'
  | 'dealValueFilledIcon'
  | 'closingDateFilledIcon'
  | 'userProfileFilledIcon'
  | 'taskFilledIcon'
  | 'meetingFilledIcon'
  | 'smsFilledIcon'
  | 'copyFilledIcon'
  | 'listViewStrokeIcon'
  | 'kanbanViewStrokeIcon'
  | 'downloadFilledIocn'
  | 'updateFilledIcon'
  | 'lunchFilledIcon'
  | 'deadlineFilledIcon'
  | 'followupFilledIcon'
  | 'campaingFilledIcon'
  | 'reminderFilledIcon'
  | 'chatFilledIcon'
  | 'inpersonmeetingFilledIcon'
  | 'coldcallingFilledIcon'
  | 'negotiationFilledIcon'
  | 'promotionaleventsFilledIcon'
  | 'upsellingFilledIcon'
  | 'managepaymentFilledIcon'
  | 'manageincidentFilledIcon'
  | 'costomerresearchFilledIcon'
  | 'margincalculateFilledIcon'
  | 'publicspeechFilledIcon'
  | 'contractdraftingFilledIcon'
  | 'producttrainingFilledIcon'
  | 'datacaptureFilledIcon'
  | 'feedbacksurveyFilledIcon'
  | 'croossellingFilledIon'
  | 'productdemonstrationFilledIcon'
  | 'proofofconceptFilledIcon'
  | 'solutiondesignFilledIcon'
  | 'needanalyticsFilledIcon'
  | 'competitiveanalysisFilledIcon'
  | 'assignmemberFilledIcon'
  | 'teaFilledIcon'
  | 'creatteamFilledIcon'
  | 'buildingFilledIcon'
  | 'currancyFilledIcon'
  | 'locationFilledIcon'
  | 'lockFilledIcon'
  | 'composeMailUploadFileFilledIcon'
  | 'composeMailDriveFilledIcon'
  | 'composeMailEditFilledIcon'
  | 'composeMailEmojiFilledIcon'
  | 'composeMailImgFilledIcon'
  | 'composeMailLinkFilledIcon'
  | 'composeMailLocktimeFilledIcon'
  | 'composeMailAlphabetFilledIcon'
  | 'resetFilledIcon'
  | 'spamMailFilledIcon'
  | 'draftMailFilledIcon'
  | 'inboxViewBackFilledIcon'
  | 'inboxViewDeleteFilledIcon'
  | 'inboxViewDraftFilledIcon'
  | 'inboxViewEmailFilledIcon'
  | 'inboxViewForwardFilledIcon'
  | 'inboxViewNextFilledIcon'
  | 'inboxViewPrevFilledIcon'
  | 'inboxViewBookmarkFilledIcon'
  | 'inboxViewPrintFilledIcon'
  | 'inboxViewReplyFilledIcon'
  | 'inboxViewShareFilledIcon'
  | 'inboxViewThreedotsFilledIcon'
  | 'inboxViewForwardBlueArrowFilled'
  | 'inboxViewReplyAllBlueArrowFilled'
  | 'inboxViewReplyBlueArrowFilled'
  | 'greenRightTickFilledIcon'
  | 'copyStrokeIcon'
  | 'editPencilFilledIcon'
  | 'unlockFilledIcon'
  | 'voipVoiceFilledBtn'
  | 'voipKeypadFilledBtn'
  | 'voipMuteFilledBtn'
  | 'voipUnmuteFilledBtn'
  | 'voipPaushFilledBtn'
  | 'voipRecordFilledBtn'
  | 'InformationIcon'
  | 'dealLoseFilledIcon'
  | 'dealWonFilledIcon'
  | 'dueFilledIcon'
  | 'startFilledIcon'
  | 'linkLeadDealFilledIcon'
  | 'timlineMessageIcon'
  | 'timelinePinIcon'
  | 'timelineEmojiIcon'
  | 'timelineDocumentDownloadIcon'
  | 'timelineDocunetCrossIcon'
  | 'contactCreatedFilledIcon'
  | 'contactOwnerFilledIcon'
  | 'documentFilledIcon'
  | 'nameChangeFilledIcon'
  | 'corruptImgFilledIcon'
  | 'alertIcon'
  | 'laptopStrokeIcon'
  | 'mobileStrokeIcon'
  | 'tabletStrokeIcon'
  | 'attachmentIcon'
  | 'snippetIcon'
  | 'filterIcon'
  | 'groupIcon'
  | 'sortIcon'
  | 'columnIcon'
  | 'streamFilledIcon'
  | 'locationStrokeIcon'
  | 'clockStrokeIcon'
  | 'moveShareIcon'
  | 'rolePremissionIcon'
  | 'pinFilledIcon'
  | 'unpinFilledIcon'
  | 'dottedClockIcon'
  | 'emojiIcon'
  | 'groupNewIcon'
  | 'locationIcon'
  | 'noteIcon'
  | 'notificationIcon'
  | 'videoIcon'
  | 'viewIcon'
  | 'videoPlayBtn'
  | 'videoPaushIcon'
  | 'emailNewIcon'
  | 'noteNewIcon'
  | 'wrapIcon'
  | 'unWrapIcon'
  | 'lineHeight40Icon'
  | 'lineHeight60Icon'
  | 'lineHeight70Icon'
  | 'publicIcon'
  | 'privateIcon'
  | 'activityLaunchIcon'
  | 'wonLostIcon'
  | 'convertLeadIcon'
  | 'startStopIcon'
  | 'markAsDoneIcon';

interface IconProps extends SVGAttributes<SVGElement> {
  iconType: IconTypes;
  className?: string;
  onClick?: (..._args: any[]) => void;
  iIconStyle?: {
    backgroundColor: string;
  };
}

const Icon = ({
  iconType,
  className = '',
  iIconStyle,
  onClick,
  ...rest
}: IconProps) => {
  const renderIcon = (icon: string) => {
    switch (icon) {
      case 'filterIcon':
        return <FilterIcon {...rest} />;
      case 'groupIcon':
        return <GroupIcon {...rest} />;
      case 'sortIcon':
        return <SortIcon {...rest} />;
      case 'columnIcon':
        return <ColumnIcon {...rest} />;
      case 'backBtnFilled':
        return <BackBtnFilled {...rest} />;
      case 'calendarFilled':
        return <CalendarFilled {...rest} />;
      case 'commentFilled':
        return <CommentFilled {...rest} />;
      case 'dashboardFilled':
        return <DashboardFilled {...rest} />;
      case 'deleteFilled':
        return <DeleteFilled {...rest} />;
      case 'editFilled':
        return <EditFilled {...rest} />;
      case 'permissionEditFilled':
        return <PermissionEditFilled {...rest} />;
      case 'eyeFilled':
        return <EyeFilled {...rest} />;
      case 'eyeHideFilled':
        return <EyeHideFilled {...rest} />;
      case 'facebookFilled':
        return <FacebookFilled {...rest} />;
      case 'filterFilled':
        return <FilterFilled {...rest} />;
      case 'graphFilled':
        return <GraphFilled {...rest} />;
      case 'homeFilled':
        return <HomeFilled {...rest} />;
      case 'infoFilled':
        return <InfoFilled {...rest} />;
      case 'mailFilled':
        return <MailFilled {...rest} />;
      case 'markAsUnreadFilledIcon':
        return <MarkAsUnreadFilled {...rest} />;
      case 'mobileMenuFilled':
        return <MobileMenuFilled {...rest} />;
      case 'notificationFilled':
        return <NotificationFilled {...rest} />;
      case 'optionFilled':
        return <OptionFilled {...rest} />;
      case 'phoneFilled':
        return <PhoneFilled {...rest} />;
      case 'plusFilled':
        return <PlusFilled {...rest} />;
      case 'plusFilledWhiteBGIcon':
        return <PlusFilledWhiteBGIcon {...rest} />;
      case 'plusFilledBlueIcon':
        return <PlusFilledBlueIcon {...rest} />;
      case 'securityFilled':
        return <SecurityFilled {...rest} />;
      case 'settingFilled':
        return <SettingFilled {...rest} />;
      case 'signupBackArrowFilled':
        return <SignupBackArrowFilled {...rest} />;
      case 'twitterFilled':
        return <TwitterFilled {...rest} />;
      case 'watchFilled':
        return <WatchFilled {...rest} />;
      case 'watchSquareFilled':
        return <WatchSquareFilled {...rest} />;
      case 'addBtnFilled':
        return <AddBtnFilled {...rest} />;
      case 'closeBtnFilled':
        return <CloseBtnFilled {...rest} />;
      case 'commentFilledBlueIcon':
        return <CommentFilledBlueIcon {...rest} />;
      case 'mailFilledOrangeIcon':
        return <MailFilledOrangeIcon {...rest} />;
      case 'phoneFilledGreenIcon':
        return <PhoneFilledGreenIcon {...rest} />;
      case 'calendarFilledBlueIcon':
        return <CalendarFilledBlueIcon {...rest} />;
      case 'accountFilledBlueIcon':
        return <AccountFilledBlueIcon {...rest} />;
      case 'activitiesFilledBlueIcon':
        return <ActivitiesFilledBlueIcon {...rest} />;
      case 'activitiesFilledBlackIcon':
        return <ActivitiesFilledBlackIcon {...rest} />;
      case 'contactFilledBlueIcon':
        return <ContactFilledBlueIcon {...rest} />;
      case 'dashboardFilledBlueIcon':
        return <DashboardFilledBlueIcon {...rest} />;
      case 'dealsFilledBlueIcon':
        return <DealsFilledBlueIcon {...rest} />;
      case 'emailFilledBlueIcon':
        return <EmailFilledBlueIcon {...rest} />;
      case 'leadsFilledBlueIcon':
        return <LeadsFilledBlueIcon {...rest} />;
      case 'logoutFilledBlueIcon':
        return <LogoutFilledBlueIcon {...rest} />;
      case 'profileFilledBlueIcon':
        return <ProfileFilledBlueIcon {...rest} />;
      case 'searchFilledBlueIcon':
        return <SearchFilledBlueIcon {...rest} />;
      case 'settingFilledBlueIcon':
        return <SettingFilledBlueIcon {...rest} />;
      case 'minusFilledBlueIcon':
        return <MinusFilledBlueIcon {...rest} />;
      case 'phoneFilledBlueIcon':
        return <PhoneFilledBlueIcon {...rest} />;
      case 'toggle3dotsIcon':
        return <Toggle3dotsIcon {...rest} />;
      case 'profileFilledIconGrey':
        return <ProfileFilledIconGrey {...rest} />;
      case 'currencyFilledIcon':
        return <CurrencyFilledIcon {...rest} />;
      case 'attachmentFilledIcon':
        return <AttachmentFilledIcon {...rest} />;
      case 'offerTagsFilledIcon':
        return <OfferTagsFilledIcon {...rest} />;
      case 'dots3HorizontalFilledIcon':
        return <Dots3HorizontalFilledIcon {...rest} />;
      case 'uploadFileFilledIcon':
        return <UploadFileFilledIcon {...rest} />;
      case 'imageIconFilledPrimaryColor':
        return <ImageIconFilledPrimaryColor {...rest} />;
      case 'imageIconFilledBlack':
        return <ImageIconFilledBlack {...rest} />;
      case 'fileIconFilledPrimaryColor':
        return <FileIconFilledPrimaryColor {...rest} />;
      case 'videoIconFilledPrimaryColor':
        return <VideoIconFilledPrimaryColor {...rest} />;
      case 'audioIconFilledPrimaryColor':
        return <AudioIconFilledPrimaryColor {...rest} />;
      case 'linkIconFilledPrimaryColor':
        return <LinkIconFilledPrimaryColor {...rest} />;
      case 'createdItemIconFilled':
        return <CreatedItemIconFilled {...rest} />;
      case 'dealValueFilledIcon':
        return <DealValueFilledIcon {...rest} />;
      case 'closingDateFilledIcon':
        return <ClosingDateFilledIcon {...rest} />;
      case 'userProfileFilledIcon':
        return <UserProfileFilledIcon {...rest} />;
      case 'taskFilledIcon':
        return <TaskFilledIcon {...rest} />;
      case 'meetingFilledIcon':
        return <MeetingFilledIcon {...rest} />;
      case 'smsFilledIcon':
        return <SmsFilledIcon {...rest} />;
      case 'copyFilledIcon':
        return <CopyFilledIcon {...rest} />;
      case 'downloadFilledIocn':
        return <DownloadFilledIocn {...rest} />;
      case 'updateFilledIcon':
        return <UpdateFilledIcon {...rest} />;
      case 'lunchFilledIcon':
        return <LunchFilledIcon {...rest} />;
      case 'deadlineFilledIcon':
        return <DeadlineFilledIcon {...rest} />;
      case 'followupFilledIcon':
        return <FollowupFilledIcon {...rest} />;
      case 'campaingFilledIcon':
        return <CampaingFilledIcon {...rest} />;
      case 'reminderFilledIcon':
        return <ReminderFilledIcon {...rest} />;
      case 'chatFilledIcon':
        return <ChatFilledIcon {...rest} />;
      case 'inpersonmeetingFilledIcon':
        return <InpersonmeetingFilledIcon {...rest} />;
      case 'coldcallingFilledIcon':
        return <ColdcallingFilledIcon {...rest} />;
      case 'negotiationFilledIcon':
        return <NegotiationFilledIcon {...rest} />;
      case 'promotionaleventsFilledIcon':
        return <PromotionaleventsFilledIcon {...rest} />;
      case 'upsellingFilledIcon':
        return <UpsellingFilledIcon {...rest} />;
      case 'managepaymentFilledIcon':
        return <ManagepaymentFilledIcon {...rest} />;
      case 'manageincidentFilledIcon':
        return <ManageincidentFilledIcon {...rest} />;
      case 'costomerresearchFilledIcon':
        return <CostomerresearchFilledIcon {...rest} />;
      case 'margincalculateFilledIcon':
        return <MargincalculateFilledIcon {...rest} />;
      case 'publicspeechFilledIcon':
        return <PublicspeechFilledIcon {...rest} />;
      case 'contractdraftingFilledIcon':
        return <ContractdraftingFilledIcon {...rest} />;
      case 'producttrainingFilledIcon':
        return <ProducttrainingFilledIcon {...rest} />;
      case 'datacaptureFilledIcon':
        return <DatacaptureFilledIcon {...rest} />;
      case 'feedbacksurveyFilledIcon':
        return <FeedbacksurveyFilledIcon {...rest} />;
      case 'croossellingFilledIon':
        return <CroossellingFilledIon {...rest} />;
      case 'productdemonstrationFilledIcon':
        return <ProductdemonstrationFilledIcon {...rest} />;
      case 'proofofconceptFilledIcon':
        return <ProofofconceptFilledIcon {...rest} />;
      case 'solutiondesignFilledIcon':
        return <SolutiondesignFilledIcon {...rest} />;
      case 'needanalyticsFilledIcon':
        return <NeedanalyticsFilledIcon {...rest} />;
      case 'competitiveanalysisFilledIcon':
        return <CompetitiveanalysisFilledIcon {...rest} />;
      case 'assignmemberFilledIcon':
        return <AssignmemberFilledIcon {...rest} />;
      case 'teaFilledIcon':
        return <TeaFilledIcon {...rest} />;
      case 'creatteamFilledIcon':
        return <CreatteamFilledIcon {...rest} />;
      case 'buildingFilledIcon':
        return <BuildingFilledIcon {...rest} />;
      case 'currancyFilledIcon':
        return <CurrancyFilledIcon {...rest} />;
      case 'locationFilledIcon':
        return <LocationFilledIcon {...rest} />;
      case 'lockFilledIcon':
        return <LockFilledIcon {...rest} />;
      case 'composeMailUploadFileFilledIcon':
        return <ComposeMailUploadFileFilledIcon {...rest} />;
      case 'composeMailDriveFilledIcon':
        return <ComposeMailDriveFilledIcon {...rest} />;
      case 'composeMailEditFilledIcon':
        return <ComposeMailEditFilledIcon {...rest} />;
      case 'composeMailEmojiFilledIcon':
        return <ComposeMailEmojiFilledIcon {...rest} />;
      case 'composeMailImgFilledIcon':
        return <ComposeMailImgFilledIcon {...rest} />;
      case 'composeMailLinkFilledIcon':
        return <ComposeMailLinkFilledIcon {...rest} />;
      case 'composeMailLocktimeFilledIcon':
        return <ComposeMailLocktimeFilledIcon {...rest} />;
      case 'composeMailAlphabetFilledIcon':
        return <ComposeMailAlphabetFilledIcon {...rest} />;
      case 'resetFilledIcon':
        return <ResetFilledIcon {...rest} />;
      case 'spamMailFilledIcon':
        return <SpamMailFilledIcon {...rest} />;
      case 'draftMailFilledIcon':
        return <DraftMailFilledIcon {...rest} />;
      case 'inboxViewBackFilledIcon':
        return <InboxViewBackFilledIcon {...rest} />;
      case 'inboxViewDeleteFilledIcon':
        return <InboxViewDeleteFilledIcon {...rest} />;
      case 'inboxViewDraftFilledIcon':
        return <InboxViewDraftFilledIcon {...rest} />;
      case 'inboxViewEmailFilledIcon':
        return <InboxViewEmailFilledIcon {...rest} />;
      case 'inboxViewForwardFilledIcon':
        return <InboxViewForwardFilledIcon {...rest} />;
      case 'inboxViewNextFilledIcon':
        return <InboxViewNextFilledIcon {...rest} />;
      case 'inboxViewPrevFilledIcon':
        return <InboxViewPrevFilledIcon {...rest} />;
      case 'inboxViewBookmarkFilledIcon':
        return <InboxViewBookmarkFilledIcon {...rest} />;
      case 'inboxViewPrintFilledIcon':
        return <InboxViewPrintFilledIcon {...rest} />;
      case 'inboxViewReplyFilledIcon':
        return <InboxViewReplyFilledIcon {...rest} />;
      case 'inboxViewShareFilledIcon':
        return <InboxViewShareFilledIcon {...rest} />;
      case 'inboxViewThreedotsFilledIcon':
        return <InboxViewThreedotsFilledIcon {...rest} />;
      case 'inboxViewForwardBlueArrowFilled':
        return <InboxViewForwardBlueArrowFilled {...rest} />;
      case 'inboxViewReplyAllBlueArrowFilled':
        return <InboxViewReplyAllBlueArrowFilled {...rest} />;
      case 'inboxViewReplyBlueArrowFilled':
        return <InboxViewReplyBlueArrowFilled {...rest} />;
      case 'greenRightTickFilledIcon':
        return <GreenRightTickFilledIcon {...rest} />;
      case 'copyStrokeIcon':
        return <CopyStrokeIcon {...rest} />;
      case 'editPencilFilledIcon':
        return <EditPencilFilledIcon {...rest} />;
      case 'unlockFilledIcon':
        return <UnlockFilledIcon {...rest} />;
      case 'voipVoiceFilledBtn':
        return <VoipVoiceFilledBtn {...rest} />;
      case 'voipKeypadFilledBtn':
        return <VoipKeypadFilledBtn {...rest} />;
      case 'voipMuteFilledBtn':
        return <VoipMuteFilledBtn {...rest} />;
      case 'voipUnmuteFilledBtn':
        return <VoipUnmuteFilledBtn {...rest} />;
      case 'voipPaushFilledBtn':
        return <VoipPaushFilledBtn {...rest} />;
      case 'voipRecordFilledBtn':
        return <VoipRecordFilledBtn {...rest} />;
      case 'dealLoseFilledIcon':
        return <DealLoseFilledIcon {...rest} />;
      case 'dealWonFilledIcon':
        return <DealWonFilledIcon {...rest} />;
      case 'dueFilledIcon':
        return <DueFilledIcon {...rest} />;
      case 'startFilledIcon':
        return <StartFilledIcon {...rest} />;
      case 'linkLeadDealFilledIcon':
        return <LinkLeadDealFilledIcon {...rest} />;
      case 'timlineMessageIcon':
        return <TimlineMessageIcon {...rest} />;
      case 'timelinePinIcon':
        return <TimelinePinIcon {...rest} />;
      case 'timelineEmojiIcon':
        return <TimelineEmojiIcon {...rest} />;
      case 'timelineDocumentDownloadIcon':
        return <TimelineDocumentDownloadIcon {...rest} />;
      case 'timelineDocunetCrossIcon':
        return <TimelineDocunetCrossIcon {...rest} />;
      case 'contactCreatedFilledIcon':
        return <ContactCreatedFilledIcon {...rest} />;
      case 'contactOwnerFilledIcon':
        return <ContactOwnerFilledIcon {...rest} />;
      case 'documentFilledIcon':
        return <DocumentFilledIcon {...rest} />;
      case 'nameChangeFilledIcon':
        return <NameChangeFilledIcon {...rest} />;
      case 'corruptImgFilledIcon':
        return <CorruptImgFilledIcon {...rest} />;
      case 'attachmentIcon':
        return <AttachmentIcon {...rest} />;
      case 'snippetIcon':
        return <SnippetIcon {...rest} />;
      case 'streamFilledIcon':
        return <StreamFilledIcon {...rest} />;
      case 'pinFilledIcon':
        return <PinFilledIcon {...rest} />;
      case 'unpinFilledIcon':
        return <UnpinFilledIcon {...rest} />;

      case 'calendarStroke':
        return <CalendarStroke {...rest} />;
      case 'commentStroke':
        return <CommentStroke {...rest} />;
      case 'dashboardStroke':
        return <DashboardStroke {...rest} />;
      case 'deleteStroke':
        return <DeleteStroke {...rest} />;
      case 'editStroke':
        return <EditStroke {...rest} />;
      case 'eyeStroke':
        return <EyeStroke {...rest} />;
      case 'eyeHideStroke':
        return <EyeHideStroke {...rest} />;
      case 'facebookStroke':
        return <FacebookStroke {...rest} />;
      case 'filterStroke':
        return <FilterStroke {...rest} />;
      case 'graphStroke':
        return <GraphStroke {...rest} />;
      case 'homeStroke':
        return <HomeStroke {...rest} />;
      case 'infoStroke':
        return <InfoStroke {...rest} />;
      case 'mailStroke':
        return <MailStroke {...rest} />;
      case 'mobileMenuStroke':
        return <MobileMenuStroke {...rest} />;
      case 'notificationStroke':
        return <NotificationStroke {...rest} />;
      case 'phoneStroke':
        return <PhoneStroke {...rest} />;
      case 'securityStroke':
        return <SecurityStroke {...rest} />;
      case 'settingStroke':
        return <SettingStroke {...rest} />;
      case 'twitterStroke':
        return <TwitterStroke {...rest} />;
      case 'watchStroke':
        return <WatchStroke {...rest} />;
      case 'watchSquareStroke':
        return <WatchSquareStroke {...rest} />;
      case 'searchStrokeIcon':
        return <SearchStrokeIcon {...rest} />;
      case 'listViewStrokeIcon':
        return <ListViewStrokeIcon {...rest} />;
      case 'kanbanViewStrokeIcon':
        return <KanbanViewStrokeIcon {...rest} />;
      case 'InformationIcon':
        return <InformationIcon {...rest} />;
      case 'alertIcon':
        return <AlertIcon {...rest} />;
      case 'laptopStrokeIcon':
        return <LaptopStrokeIcon {...rest} />;
      case 'mobileStrokeIcon':
        return <MobileStrokeIcon {...rest} />;
      case 'tabletStrokeIcon':
        return <TabletStrokeIcon {...rest} />;
      case 'locationStrokeIcon':
        return <LocationStrokeIcon {...rest} />;
      case 'clockStrokeIcon':
        return <ClockStrokeIcon {...rest} />;
      case 'moveShareIcon':
        return <MoveShareIcon {...rest} />;
      case 'rolePremissionIcon':
        return <RolePremissionIcon {...rest} />;

      case 'dottedClockIcon':
        return <DottedClockIcon {...rest} />;
      case 'emojiIcon':
        return <EmojiIcon {...rest} />;
      case 'groupNewIcon':
        return <GroupNewIcon {...rest} />;
      case 'locationIcon':
        return <LocationIcon {...rest} />;
      case 'noteIcon':
        return <NoteIcon {...rest} />;
      case 'notificationIcon':
        return <NotificationIcon {...rest} />;
      case 'videoIcon':
        return <VideoIcon {...rest} />;
      case 'viewIcon':
        return <ViewIcon {...rest} />;
      case 'videoPlayBtn':
        return <VideoPlayBtn {...rest} />;
      case 'videoPaushIcon':
        return <VideoPaushIcon {...rest} />;
      case 'emailNewIcon':
        return <EmailNewIcon {...rest} />;
      case 'noteNewIcon':
        return <NoteNewIcon {...rest} />;
      case 'wrapIcon':
        return <WrapIcon {...rest} />;
      case 'unWrapIcon':
        return <UnWrapIcon {...rest} />;
      case 'lineHeight40Icon':
        return <LineHeight40Icon {...rest} />;
      case 'lineHeight60Icon':
        return <LineHeight60Icon {...rest} />;
      case 'lineHeight70Icon':
        return <LineHeight70Icon {...rest} />;
      case 'publicIcon':
        return <PublicIcon {...rest} />;
      case 'privateIcon':
        return <PrivateIcon {...rest} />;
      case 'activityLaunchIcon':
        return <ActivityLaunchIcon {...rest} />;
      case 'wonLostIcon':
        return <WonLostIcon {...rest} />;
      case 'convertLeadIcon':
        return <ConvertLeadIcon {...rest} />;
      case 'startStopIcon':
        return <StartStopIcon {...rest} />;
      case 'markAsDoneIcon':
        return <MarkAsDoneIcon {...rest} />;

      default:
        return <> </>;
    }
  };

  return (
    <div
      style={iIconStyle}
      className={`i__Icon ${className}`}
      onClick={onClick}
    >
      <div>{renderIcon(iconType)}</div>
    </div>
  );
};

export default Icon;
