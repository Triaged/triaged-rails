class GoogleAnalytics::Status::Daily < FeedItem
  include Mongoid::Document

  field :date, type: Date
  field :property_external_id, type: String

	#embeds_many :daily_details, :class_name => "GoogleAnalytics::Status::DailyDetail"
  embeds_many :data_sets, :class_name => "GoogleAnalytics::Status::DataSet", cascade_callbacks: true

  def provider_name
  	"google_analytics"
  end

  def build_html_url
		self.html_url = "http://www.google.com/analytics/"
	end

	def ga_property
		company.default_google_analytics_account.properties.where(external_id: self.property_external_id).first
	end
end
