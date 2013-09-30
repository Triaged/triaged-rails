class Kiln::Event::Commit
  include Mongoid::Document

  embedded_in :push, class_name: "Kiln::Event::Push"
  
  field :author, type: String
  field :branch, type: String
  field :timestamp, type: DateTime
  field :message, type: String
  field :url, type: String
  field :external_id, type: Integer


end
