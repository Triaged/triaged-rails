class CreateCursor < ActiveRecord::Migration
  def change
    create_table :cursors do |t|
      t.string :current
      t.reference :company
      t.reference :provider
    end
  end
end
