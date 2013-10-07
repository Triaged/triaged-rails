class ConnectedProvider
  include Mongoid::Document

  embedded_in :company
  belongs_to :provider

  validates :provider, uniqueness: true
end
