class CreateConnectedProviderProperties < ActiveRecord::Migration
  def change
    create_table :connected_provider_properties do |t|
      t.references :company_app, index: true
      t.references :provider_property, index: true
      t.integer :status, default: 0

      t.timestamps
    end
  end
end
