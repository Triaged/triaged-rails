class Dropbox::BaseService

	attr_accessor :company

	def initialize company_id
		@company = Company.find(company_id)
		@dropbox_client = DropboxClient.new(@company.dropbox_provider_credentials.access_token)
	end

end