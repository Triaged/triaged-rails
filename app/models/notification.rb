class Notification
  include Mongoid::Document
  include Mongoid::Timestamps

  embedded_in :user

  field :body, type: String
  field :viewed, type: Boolean, default :false

  
end
