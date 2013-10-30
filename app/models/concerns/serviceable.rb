module Serviceable
	extend ActiveSupport::Concern

	included do 
		has_many :github_organizations, :class_name => "Github::Org"
		has_many :google_analytics_accounts, :class_name => "GoogleAnalytics::Account"
	end

	def default_github_org
		github_organizations.where(default: true).first
	end

	def default_google_analytics_account
		google_analytics_accounts.where(default: true).first
	end
	
end