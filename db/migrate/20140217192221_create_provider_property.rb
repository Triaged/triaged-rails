class CreateProviderProperty < ActiveRecord::Migration
  def change
    create_table :provider_properties do |t|
      t.references :provider_account
      t.string :external_id
      t.string :name
    end
  end
end
