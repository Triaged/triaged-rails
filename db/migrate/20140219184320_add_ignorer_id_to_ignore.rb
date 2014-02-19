class AddIgnorerIdToIgnore < ActiveRecord::Migration
  def change
    add_column :ignores, :ignorer_id, :integer
  end
end
