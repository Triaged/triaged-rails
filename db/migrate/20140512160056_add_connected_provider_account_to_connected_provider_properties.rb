class AddConnectedProviderAccountToConnectedProviderProperties < ActiveRecord::Migration
  def change
    add_reference :connected_provider_properties, :connected_provider_account
    add_index :connected_provider_properties, :connected_provider_account_id,  :name => 'connected_p_account_index_on_connected_pp'
  end
end
