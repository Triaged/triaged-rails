class AdminsController < ApplicationController
	before_action :authenticate_admin!
	before_action :set_admin

	def show
		@providers_count = Provider.count
		@user_count = User.count
		@connected_provider_count = ConnectedProvider.count
		@feed_items_count = FeedItem.count
		@company_count = Company.count
	end

private

	def set_admin
		@admin = current_admin
	end

end
