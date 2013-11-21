class Admin::WelcomeController < ApplicationController
	before_action :authenticate_admin!

	def index
		@user_count = User.count
		@company_count = Company.count
		@feed_item_count = Company.sum(:feed_items)
	end

end
