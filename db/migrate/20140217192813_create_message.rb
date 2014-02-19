class CreateMessage < ActiveRecord::Migration
  def change
    create_table :messages do |t|
      t.references :feed_item
      t.references :author
      t.string :uuid
      t.string :author_name
      t.datetime :timestamp
    end
  end
end
