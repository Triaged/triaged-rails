class Github::Repo
  include Mongoid::Document

  belongs_to :company
  belongs_to :user
  embeds_many :commits, :class_name => "Github::Commit"
  embeds_many :issues, :class_name => "Github::Issue"

  field :external_id, type: Integer
  field :name, type: String
  field :full_name, type: String
  field :html_url, type: String
  field :url, type: String
  field :issues_url, type: String
  field :owner, type: String

	validates_uniqueness_of :external_id
  

end
