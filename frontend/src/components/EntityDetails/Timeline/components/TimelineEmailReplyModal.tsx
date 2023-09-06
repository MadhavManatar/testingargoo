import Modal from 'components/Modal';
import EmailReply from 'pages/Email/components/EmailReply';
import { useGetEmail } from 'pages/Email/hooks/useEmailService';
import { EmailModalType, ReplyFormType } from 'pages/Email/types/email.type';
import { MailTokenProvider } from 'pages/Setting/email-setting/EmailSetting/types/userToken.type';
import React, { useEffect, useState } from 'react';
import { TimelineType } from '../types';

type EmailReplyModalProps = {
  email_id: number;
  isOpen: boolean;
  close: (timeLineEmailData?: TimelineType) => void;
  model_name: string;
  model_record_id: number;
  showReplyForm : ReplyFormType;
  isHideReply : boolean 
};

const TimelineEmailReplyModal = (props: EmailReplyModalProps) => {
  const { email_id, close, isOpen, model_name, model_record_id,showReplyForm, isHideReply } = props;
  const { emailDetails, getEmailDetails, emailDetailLoading } = useGetEmail();
  const [emailUndoHelperObj, setEmailUndoHelperObj] = useState<{
    id?: number;
    delay_time: number;
    provider?: MailTokenProvider;
  }>({ delay_time: 10 });
  const [, setModal] = useState<EmailModalType>();
  const [, setShowReplyForm] = useState<ReplyFormType>();
 const[headingNameTimelineEmail,setHeadingNameTimelineEmail] = useState("")
  useEffect(() => {
    if (email_id) {
      getEmailDetails(email_id);
    }
  }, [email_id]);
  useEffect(() => {
    if (showReplyForm === "forward") {
      setHeadingNameTimelineEmail("Forward");
    }else if(showReplyForm === "reply"){
      setHeadingNameTimelineEmail("Reply");
    }else if(showReplyForm === "replyAll"){
      setHeadingNameTimelineEmail("Reply All");
    }
  }, [showReplyForm]);
   
  return (
    <Modal
      title= {headingNameTimelineEmail}
      visible={isOpen}
      onClose={() => close()}
      width="778px"
      showFooter={false}
    >
      {emailDetailLoading ? (
        <>loading...</>
      ) : (
        <EmailReply
          emailUndoHelperObj={emailUndoHelperObj}
          setEmailUndoHelperObj={setEmailUndoHelperObj}
          setModal={setModal}
          setShowReplyForm={setShowReplyForm}
          defaultRecipient={emailDetails?.messages[0].email_recipients}
          emailData={emailDetails?.messages?.[0]}
          emailDetails={emailDetails}
          closeReplyModal={(timeLineEmailData?: TimelineType) => {
            close(timeLineEmailData);
          }}
          model_name={model_name}
          model_record_id={model_record_id}
          showReplyForm={showReplyForm}
          isHideReply = {isHideReply}
        />
      )} 
    </Modal>
  );
};

export default TimelineEmailReplyModal;
