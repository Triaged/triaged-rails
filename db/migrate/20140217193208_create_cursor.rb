class CreateCursor < ActiveRecord::Migration
  def change
    create_table :cursors do |t|
      t.string :current
      t.references :company
      t.references :provider
    end
  end
end
