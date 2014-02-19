class AddEventImageToBaseCards < ActiveRecord::Migration
  def change
    add_column :feed_items, :event_image, :string
  end
end
