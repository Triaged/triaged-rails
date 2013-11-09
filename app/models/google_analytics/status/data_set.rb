class GoogleAnalytics::Status::DataSet
	include Mongoid::Document

	field :label, type: String
  field :total_count, type: Integer
  field :details, type: Array
  field :max_y_count, type: Integer

  before_create :calculate_max_y_count


  def calculate_max_y_count
  	Rails.logger.info label
  	Rails.logger.info details.inspect
  	max_count = 0
  	details.each do |detail|
  		Rails.logger.info detail
  		max_count = detail[:y] if (detail[:y] > max_count)
  		Rails.logger.info "Max Count: #{max_count}"
  	end
  	self.max_y_count = max_count
  end

end