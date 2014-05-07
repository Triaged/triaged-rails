class CreateProviderWorkflows < ActiveRecord::Migration
  def change
    create_table :provider_workflows do |t|
      t.string :name
      t.string :slug
      t.integer :workflow_type
      t.references :provider, index: true
      t.boolean :active

      t.timestamps
    end
  end
end
