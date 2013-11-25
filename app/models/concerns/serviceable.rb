module Serviceable
	extend ActiveSupport::Concern

	included do 
		has_many :provider_accounts
	end

	def default_github_org
		provider_accounts.where(provider: Provider.named("github"), default: true).first
	end

	def default_google_analytics_account
		provider_accounts.where(provider: Provider.named("google_analytics"), default: true).first
	end

	def default_appfigures_account
		provider_accounts.where(provider: Provider.named("appfigures"), default: true).first
	end

end