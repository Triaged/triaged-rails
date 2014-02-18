class CreateShare < ActiveRecord::Migration
  def change
    create_table :shares do |t|
      t.reference :feed_item
      t.reference :user
      t.string :recipient_email
      t.boolean :viewed
    end
  end
end
