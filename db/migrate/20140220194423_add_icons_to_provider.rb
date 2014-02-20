class AddIconsToProvider < ActiveRecord::Migration
  def change
    add_column :providers, :large_icon, :string
    add_column :providers, :small_icon, :string
  end
end
