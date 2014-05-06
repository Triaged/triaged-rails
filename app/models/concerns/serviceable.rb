module Serviceable
	extend ActiveSupport::Concern

	included do 
		has_many :provider_accounts
	end

end