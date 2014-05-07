class Github::AccountService < Github::BaseService
	
	def fetch_accounts
		accounts = []

		accounts << fetch_personal_account
		accounts << fetch_organizations

		return accounts
	end

	def fetch_organizations
		organizations = @github.orgs.all.to_a
		organizations.collect { |org| {external_id: org.id.to_s, name: org.login, personal: false} }
	end

	def fetch_personal_account
		user_account = @github.users.get
		{ external_id: user_account.id.to_s, name: user_account.login, personal: true }
	end

	#
	### Properties
	#
	def fetch_properties(account)
		# Get all repos for the org
		res = account.personal ? @github.repos.list : @github.repos.list(org: account.name)
		res.each_page { |page| page.each do |repo|
			account.provider_properties << ProviderProperty.new(
				external_id: repo.id.to_s, 
				url: repo.html_url, 
				name: repo.name,
				#owner: repo.owner.login
			)
		end }
	end

	

end