class Services::GoogleAnalyticsController < ServiceController
	before_action :authenticate_user!
	before_action :set_company

	def account_list
		@accounts = GoogleAnalytics::SetupService.new(@company.id).fetch_accounts
		redirect_to(oauth_complete_path) if (@accounts.count == 1)
		@skip_footer = true
	end

	def set_default_account
		account = @company.provider_accounts.find(params[:account][:id])
		account.set_default_account!
		
		redirect_to(oauth_complete_path)
	end


	private
	
	def set_company
		@company = current_user.company
	end


end
