class ReportsTo < ActiveRecord::Base
	belongs_to :boss, class_name: "User", foreign_key: "boss_id"
	belongs_to :report,  class_name: "User", foreign_key: "report_id"

end
