class Bitbucket::Event::Commit
  include Mongoid::Document

  embedded_in :push, class_name: "Bitbucket::Event::Push"
  
  field :author, type: String
  field :author_email, type: String
  field :timestamp, type: DateTime
  field :message, type: String
  field :url, type: String
  field :external_id, type: Integer
  field :branch, :type => String

  

end
