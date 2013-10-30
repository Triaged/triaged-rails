class GoogleAnalytics::Account
  include Mongoid::Document

  belongs_to :company, :class_name => "Company", :inverse_of => :google_analytics_accounts
  belongs_to :user

  embeds_many :properties, :class_name => "GoogleAnalytics::Property"

  field :external_id, type: String
  field :name, type: String
  field :default, type: Boolean, default: false
  
	validates_uniqueness_of :external_id
end
