class CreateMessage < ActiveRecord::Migration
  def change
    create_table :messages do |t|
      t.reference :feed_item
      t.reference :author
      t.string :uuid
      t.string :author_name
      t.datetime :timestamp
    end
  end
end
