class CreateStatusReports < ActiveRecord::Migration
  def change
    create_table :status_reports do |t|
      t.date :status_date
      t.references :user, index: true
      t.string :workflow_state

      t.timestamps
    end
  end
end
