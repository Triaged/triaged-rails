class ProviderSettingsSerializer < ActiveModel::Serializer
  
  attribute :test
  #has_many :providers

  def test
  	Rails.logger.info object.inspect
  	"@ADFADSFASFASFA"
  end

end
