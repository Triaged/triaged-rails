class Bitbucket::BaseService

	attr_accessor :company

	def initialize company_id
		@company = Company.find(company_id)
		RestClient.log = Rails.logger
	end

	def headers
		headers = { :authorization => 
			"OAuth oauth_signature_method=PLAINTEXT," \
			"oauth_consumer_key=#{ENV['BITBUCKET_KEY']}," \
			"oauth_token=#{@company.bitbucket_provider_credentials.access_token},"\
			"oauth_signature=#{ENV['BITBUCKET_SECRET']}&#{@company.bitbucket_provider_credentials.refresh_token}"
		}
	end
end