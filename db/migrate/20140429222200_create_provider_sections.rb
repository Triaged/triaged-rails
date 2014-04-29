class CreateProviderSections < ActiveRecord::Migration
  def change
    create_table :provider_sections do |t|
      t.string :name

      t.timestamps
    end
  end
end
