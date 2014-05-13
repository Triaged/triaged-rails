class ConnectedAccountProviderProperty < ActiveRecord::Base
  belongs_to :connected_provider_account
  belongs_to :provider_property

   validates :provider_property, :uniqueness => { :scope => :connected_provider_account }
end
