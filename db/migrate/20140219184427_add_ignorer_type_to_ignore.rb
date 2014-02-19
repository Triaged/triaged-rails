class AddIgnorerTypeToIgnore < ActiveRecord::Migration
  def change
    add_column :ignores, :ignorer_type, :string
  end
end
