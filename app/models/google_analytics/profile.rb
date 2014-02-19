class GoogleAnalytics::Profile
  
  #belongs_to :company
  
  #belongs_to :user

  # field :external_id, type: String
  # field :name, type: String
  # field :url, type: String
  # field :default, type: Boolean, default: false
  
	#validates_uniqueness_of :external_id
end
