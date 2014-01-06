class GoogleAnalytics::AccountService < GoogleAnalytics::BaseService
	attr_accessor :user

	def initialize company_id
		@company = Company.find(company_id)
		@user = Legato::User.new(access_token)
	end

	def fetch_accounts
		@user.accounts.each do |account|
			ga_account = @company.provider_accounts.find_or_create_by(
					name: account.name,
					external_id: account.id,
					provider: Provider.named("google_analytics")
				)

			account.web_properties.each do |property|
				ga_account.provider_properties << GoogleAnalytics::Property.find_or_initialize_by(
					name: property.name,
					external_id: property.id,
				)
			end
		end

		# Set account to default if only 1 exists
		ga_accounts = @company.provider_accounts.provided_by(Provider.named "google_analytics")
		ga_accounts.first.set_default_account! if (ga_accounts.count == 1)

		return ga_accounts
	end

end