class Messages::Chat < ActiveRecord::Base
	acts_as :message
	
  # field :body, type: String
  # field :user_mentions, type: Array
  

end
