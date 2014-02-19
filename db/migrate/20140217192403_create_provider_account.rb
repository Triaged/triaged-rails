class CreateProviderAccount < ActiveRecord::Migration
  def change
    create_table :provider_accounts do |t|
      t.references :provider
      t.references :company
      t.string :external_id
      t.string :name
      t.string :url
      t.boolean :default, default: false
      t.boolean :personal, default: false
    end
  end
end
