class Github::Org
  include Mongoid::Document

  belongs_to :company
  belongs_to :user
  embeds_many :repos, :class_name => "Github::Repo"
  
  field :external_id, type: Integer
  field :name, type: String
  field :url, type: String
  
  

	validates_uniqueness_of :external_id
  

end
