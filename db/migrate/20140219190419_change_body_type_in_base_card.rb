class ChangeBodyTypeInBaseCard < ActiveRecord::Migration
  def change
  	change_column :base_cards, :title, :text
  	change_column :base_cards, :body, :text
  	change_column :base_cards, :footer, :text
  end
end
