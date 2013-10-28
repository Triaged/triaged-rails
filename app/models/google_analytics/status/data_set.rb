class GoogleAnalytics::Status::DataSet
	include Mongoid::Document

	field :label, type: String
  field :total_count, type: Integer
  field :details, type: Array
  field :max_y_count, type: Integer

  before_create :calculate_max_y_count


  def calculate_max_y_count
  	Rails.logger.info
  	max_count = 0
  	details.each do |detail|
  		key, value = detail.first
  		max_count = value if (value > max_count)
  	end
  	self.max_y_count = max_count
  end

end