class CreateStatusEntries < ActiveRecord::Migration
  def change
    create_table :status_entries do |t|
      t.references :status_report, index: true
      t.text :body

      t.timestamps
    end
  end
end
