class Common::AuthorService

	attr_accessor :user, :author_json, :company
	
	def initialize(author_json, company)
		@author_json = RecursiveOpenStruct.new(author_json)
		@company = company

		build_user
	end

	def user?
		!@user.nil?
	end

	def user
		@user
	end

private
	
	def build_user
		puts("build user")
		user_from_json if @author_json
	end

	def user_from_json
		puts("looking for user: #{@author_json.name}")
		@user = User.find_by(name: @author_json.name) if @author_json.name

		@user = User.find_or_initialize_by(email: @author_json.email) unless @user
		
		if @user.new_record?
			@user.company = @company
			@user.full_name(@author_json.name) if @author_json.name
			@user.save 
		end
	end
end