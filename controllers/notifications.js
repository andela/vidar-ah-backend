import { notification, User } from '../models';

/**
 * @class NotificationsController
 */
class NotificationsController {
  /**
   * @description - allows users to select a notification choice
   * [ 'appOnly', 'emailOnly', 'both', or 'none'] are allowed notificationChoice values
   * @static
   * @param {Object} req - request object
   * @param {Object} res - response object
   * @returns {Object} - success res or error message
   */
  static async setNotificationChoice(req, res) {
    const { notificationChoice } = req;
    const { id } = req.user;
    try {
      const result = await User.update(
        {
          notificationChoice
        },
        { where: { id }, returning: true }
      );
      const [didUpdate, [user]] = result;
      if (didUpdate) {
        const {
          dataValues: { notificationChoice: choice }
        } = user;
        return res.status(200).json({
          success: true,
          message: 'Your notification choice has been set',
          choice
        });
      }
    } catch (error) {
      return res
        .status(500)
        .json({ success: false, errors: [error.message] });
    }
  }

  /**
   * @description this method is responsible for getting all user notifications
   * @static
   * @param {object} req - the req object
   * @param {object} res - the res object
   * @returns {object} - the success or error res
   */
  static async getNotifications(req, res) {
    const { id: userId } = req.user;
    try {
      const notifications = await notification.findAll({
        where: { userId },
      });
      return res.status(200).json({
        success: true,
        message: 'All notifications successfully fetched',
        notifications
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        errors: [error.message]
      });
    }
  }
}

export default NotificationsController;
