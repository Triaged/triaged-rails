class GoogleAnalytics::Property
  include Mongoid::Document
  
  embedded_in :account, :class_name => "GoogleAnalytics::Account"

  field :external_id, type: Integer
  field :name, type: String
  field :active, type: String
end
