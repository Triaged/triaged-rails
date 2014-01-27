class Api::V1::NotificationsController < API::BaseController

	def index
		@notifications = current_user.notifications
    respond_with @notifications
	end

	def viewed
		@notification = current_user.notifications.find(params[:id])
		@notification.update_attribute(viewed: true)
		respond_with @notification
	end
end
