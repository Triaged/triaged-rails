class Github::Repo
  include Mongoid::Document

  embedded_in :org, :class_name => "Github::Org"
  embeds_many :commits, :class_name => "Github::Commit"
  
  field :external_id, type: Integer
  field :name, type: String
  field :full_name, type: String
  field :html_url, type: String
  field :url, type: String
  field :issues_url, type: String
  field :owner, type: String

	validates_uniqueness_of :external_id
  

end
