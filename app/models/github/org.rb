class Github::Org
  include Mongoid::Document

  belongs_to :company, :class_name => "Company", :inverse_of => :github_organizations
  
  belongs_to :user

  embeds_many :repos, :class_name => "Github::Repo"
  
  field :external_id, type: Integer
  field :name, type: String
  field :url, type: String
  field :default, type: Boolean, default: false
  
  

	validates_uniqueness_of :external_id
  

end
