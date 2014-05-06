class ApiToken < ActiveRecord::Base
  extend FriendlyId

  belongs_to :tokenable, polymorphic: true

  friendly_id :random_token, use: [:slugged, :finders]
	
	def random_token
    Tokenizer.unique_token(6)
  end

  def company
  	tokenable.instance_of?(Company)? tokenable : tokenable.company
  end

  def app
  	tokenable.instance_of?(CompanyApp) ? tokenable : nil
  end

end
