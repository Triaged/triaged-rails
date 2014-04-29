class AddUrlToProviderProperties < ActiveRecord::Migration
  def change
    add_column :provider_properties, :url, :string
  end
end
