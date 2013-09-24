class Github::Commit
  include Mongoid::Document

  belongs_to :push, class_name: "Github::Event::Push"
  embedded_in :repo, class_name: "Github::Repo"

  field :author, type: String
  field :author_email, type: String
  field :timestamp, type: DateTime
  field :message, type: String
  field :url, type: String
  field :external_id, type: Integer

  validates_uniqueness_of :external_id

end
