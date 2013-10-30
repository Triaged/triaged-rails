class GoogleAnalytics::SetupService < GoogleAnalytics::BaseService
	include Rails.application.routes.url_helpers

	attr_accessor :user

	def initialize company_id
		@company = Company.find(company_id)
		@user = Legato::User.new(access_token)
	end

	def fetch_remote_profiles
		@user.accounts.each do |account|
			ga_account = @company.google_analytics_accounts.create(
					name: account.name,
					external_id: account.id,
				)

			account.web_properties.each do |property|
				ga_account.properties.create(
					name: property.name,
					external_id: property.id,
					active: true
				)
			end
		end

		# Set account to default if only 1 exists
		set_default_account(@company.google_analytics_accounts.first.id) if (@company.google_analytics_accounts.count == 1)
	end

	def set_default_account id
		@company.google_analytics_accounts.find(id).update_attribute(:default, true)
	end

end