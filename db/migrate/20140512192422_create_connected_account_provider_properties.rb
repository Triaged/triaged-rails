class CreateConnectedAccountProviderProperties < ActiveRecord::Migration
  def change
    create_table :connected_account_provider_properties do |t|
      t.references :connected_provider_account
      t.references :provider_property
      t.timestamps
    end

    add_index :connected_account_provider_properties, :connected_provider_account_id,  :name => 'cpa_on_capp'
    add_index :connected_account_provider_properties, :provider_property_id,  :name => 'pp_on_capp'
  end
end
