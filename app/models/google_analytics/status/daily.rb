class GoogleAnalytics::Status::Daily < FeedItem
  include Mongoid::Document

  field :date, type: Date
  field :property_exernal_id, type: String

	#embeds_many :daily_details, :class_name => "GoogleAnalytics::Status::DailyDetail"
  embeds_many :data_sets, :class_name => "GoogleAnalytics::Status::DataSet", cascade_callbacks: true

  def provider_name
  	"google_analytics"
  end

  def build_html_url
		self.html_url = "http://www.google.com/analytics/"
	end

	def property
		company.default_google_analytics_account.properties.find_by external_id: property_exernal_id
	end
end
