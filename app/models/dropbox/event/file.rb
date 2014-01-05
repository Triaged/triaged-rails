class Dropbox::Event::File
  include Mongoid::Document

  embedded_in :update, class_name: "Dropbox::Event::Update"
  
  field :status, type: String
  field :path, type: String
  field :thumbnail, type: String
  field :root, type: String
  field :mime_type, type: String
  field :rev, type: String
  field :modified, type: DateTime
  field :icon, type: String


end
