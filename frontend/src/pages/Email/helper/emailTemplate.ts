import { Tab, TAB_CONTENT_OBJ } from 'constant/emailTemplate.constant';
import { EmailDetail } from '../types/email.type';
import format from 'date-fns-tz/format';

export const getIconClass = (currentTab: string) => {
  switch (currentTab) {
    case Tab.ACCOUNT:
      return 'templateInput__field__account';
    case Tab.CONTACT:
      return 'templateInput__field__contact';
    case Tab.DEAL:
      return 'templateInput__field__deal';
    case Tab.LEAD:
    default:
      return 'templateInput__field__lead';
  }
};

export const convertEmailTemplateFieldsDisabledToNormal = (html: string) => {
  Object.values(TAB_CONTENT_OBJ).forEach((values) => {
    values.forEach((obj) => {
      html = html.replaceAll(
        `<input class="templateInput__field ${getIconClass(
          obj.moduleName
        )}" disabled="" id="${obj.id}" placeholder="${obj.placeholder}">&nbsp;`,
        `<input class="templateInput__field" id="${obj.id}" placeholder="${obj.placeholder}">&nbsp;`
      );
    });
  });
  return html;
};
export const getForwardBodyTemplate = (emailData: EmailDetail): string => {
  let msg = '';
  const emailRecipients =
    emailData.email_recipients
      ?.map((obj) => obj.emails.map((innerObj) => innerObj))
      .flat() ?? [];
  msg = `
    <html>
      <head></head>
        <body>
            ---------- Forwarded message ---------<br /> 
            From: ${emailData?.from_email_address}  <br />
            Date: ${format(new Date(emailData.created_at), 'MM/dd/yyyy') || ""} <br />
            Subject: ${emailData?.subject || ""}<br />
            To: ${getToEmailTemplateString(emailRecipients) || ""}<br /><br />
            
            ${emailData?.short_description}
        </body>
    </html>
  `;
  return msg;
};
export const getEmptyTemplate = (): string => {
  const msg = `
    <html>
      <head></head>
        <body>
        </body>
    </html>
  `;
  return msg;
};
const getToEmailTemplateString = (
  emails: { name?: string; email: string }[]
): string => {
  let emailString = '';
  emails.forEach((er, i) => {
    const comma = emails.length === i + 1 ? '' : ', ';
    emailString += `${er.name ? er.name : er.email} < ${er.email} >${comma}`;
  });
  return emailString;
};
