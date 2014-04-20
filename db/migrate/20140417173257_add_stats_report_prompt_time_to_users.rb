class AddStatsReportPromptTimeToUsers < ActiveRecord::Migration
  def change
    add_column :users, :status_report_prompt_time, :datetime
  end
end
