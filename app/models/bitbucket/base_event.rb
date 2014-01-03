class Bitbucket::BaseEvent < FeedItem

	field :org_name, :type => String
  field :repo_name, :type => String

  belongs_to :provider_account

  def repo
  	provider_account.provider_properties.find_by name: repo_name
  end

	def after_build_hook company
		provider_account = company.provider_accounts.find_by(provider: Provider.named("bitbucket"), name: org_name, default: true)
		self.provider_account = provider_account
	end

	def ignorable_objects
		[repo]
	end

end


