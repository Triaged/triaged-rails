class CompanyApp < ActiveRecord::Base
	include AppFeedable

	enum app_type: [ :web, :mobile, :service ]

  belongs_to :company
  
  has_one :connected_provider_account
  has_many :connected_provider_properties

  validates :name, :uniqueness => { :scope => :company_id }
end
