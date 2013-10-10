class PushToken
  include Mongoid::Document

  embedded_in :user

  field :service, type: String
  field :token, type: String
  field :count, type: Integer, default: 0

  before_create :strip_spaces

  def strip_spaces
  	token.delete(' ')
  end
end
