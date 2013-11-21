class Admin::WelcomeController < ApplicationController
	before_action :authenticate_admin!
	before_action :set_admin

	def index
		@user_count = User.count
		@company_count = Company.count
		@feed_item_count = Company.all.sum {|company| company.feed_items.count}
		@connected_count = Company.all.sum {|company| company.connected_providers.count}
	end

	def set_admin
		@admin = current_admin
	end

end
