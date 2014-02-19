class CreateShare < ActiveRecord::Migration
  def change
    create_table :shares do |t|
      t.references :feed_item
      t.references :user
      t.string :recipient_email
      t.boolean :viewed
    end
  end
end
