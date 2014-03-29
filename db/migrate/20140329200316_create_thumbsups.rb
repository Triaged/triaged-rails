class CreateThumbsups < ActiveRecord::Migration
  def change
    create_table :thumbsups do |t|
      t.references :feed_item
      t.references :user

      t.timestamps
    end
  end
end
