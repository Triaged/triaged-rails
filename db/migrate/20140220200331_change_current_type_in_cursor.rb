class ChangeCurrentTypeInCursor < ActiveRecord::Migration
  def change
  	change_column :cursors, :current, :text
  end
end
