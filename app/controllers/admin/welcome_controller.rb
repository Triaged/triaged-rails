class Admin::WelcomeController < ApplicationController
	before_action :authenticate_admin!

	def index
		@user_count = User.count
		@company_count = Company.count
		@feed_item_count = Company.all.sum {|company| company.feed_items.count}
		@connected_count = Company.all.sum {|company| company.connected_providers.count}
	end

end
