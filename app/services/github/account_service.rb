class Github::AccountService < Github::BaseService
	
	def fetch_accounts
		fetch_personal_account
		fetch_organizations

		github_orgs = @company.provider_accounts.provided_by(Provider.named "github")

		# Set account to default if only 1 exists, this will only be a personal account
		if (github_orgs.count == 1)
			github_orgs.first.set_default_account!
			Github::CreateHooks.perform_async(@company.id.to_s)
		end

		return github_orgs
	end

	def fetch_properties(account)
		# Get all repos for the org
		res = account.personal ? @github.repos.list : @github.repos.list(org: account.name)
		res.each_page { |page| page.each do |repo|
			account.provider_properties << Github::Repo.new(
				external_id: repo.id.to_s, 
				html_url: repo.html_url, 
				url: repo.url, 
				name: repo.name,
				full_name: repo.full_name,
				owner: repo.owner.login
			)
		end }
	end

	def fetch_organizations
		organizations = @github.orgs.all.to_a
		Rails.logger.info organizations
		
		organizations.each do |org|
			@company.provider_accounts.find_or_create_by(
				external_id: org.id.to_s, 
				name: org.login, 
				url: org.url,
				provider: Provider.named("github")
			)
		end
	end

	def fetch_personal_account
		user_account = @github.users.get
		@company.provider_accounts.find_or_create_by(
			external_id: user_account.id.to_s, 
			name: user_account.login, 
			url: user_account.html_url,
			personal: true,
			provider: Provider.named("github")
		)
	end

	#
	### Properties
	#

	

end