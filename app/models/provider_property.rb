class ProviderProperty < ActiveRecord::Base
	
	belongs_to :provider
  belongs_to :company
  has_many :connected_provider_properties
  
	validates :external_id, :uniqueness => { :scope => [:provider, :company] }


	
end
