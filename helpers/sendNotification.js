import sendMail from './emails';
import pusher from '../config/pusher';


/**
 * @description This function inserts the notification data into the notification table
 * @param {object} data which includes the userId, name, choice of notification,
 * message to be sent, url and email
 * @returns {boolean} true if data is successfully saved, and false otherwise
 */
const sendNotification = async ({
  userId, email, name, choice, message, url = null
}) => {
  try {
    if (choice === 'emailOnly' || choice === 'both') {
      const subject = 'Authors Haven';
      await sendMail(
        {
          email,
          name,
          subject,
          message,
          url
        },
        true
      );
    }
    if (choice === 'appOnly' || choice === 'both') {
      pusher.trigger(
        'vidar-notifications',
        `notify-${userId}`,
        {
          message
        }
      );
    }
    return true;
  } catch (error) {
    return false;
  }
};

export default sendNotification;
