class CreateReportsTos < ActiveRecord::Migration
  def change
    create_table :reports_tos do |t|
      t.references :boss
      t.references :report

      t.timestamps
    end
  end
end
