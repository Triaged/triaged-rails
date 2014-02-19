class AddEventImageToBaseCards < ActiveRecord::Migration
  def change
    add_column :base_cards, :event_image, :string
  end
end
