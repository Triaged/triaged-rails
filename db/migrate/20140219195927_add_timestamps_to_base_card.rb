class AddTimestampsToBaseCard < ActiveRecord::Migration
  def change
  	change_table(:base_cards) { |t| t.timestamps }
  end
end
