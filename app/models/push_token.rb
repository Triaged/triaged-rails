class PushToken
  include Mongoid::Document

  embedded_in :user

  field :service, type: String
  field :token, type: String
  field :count, type: Integer
end
