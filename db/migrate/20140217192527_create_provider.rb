class CreateProvider < ActiveRecord::Migration
  def change
    create_table :providers do |t|
      t.string :name
      t.string :title
      t.string :short_title
      t.boolean, :active
      t.boolean, :oauth, default: false
      t.boolean :zapier, default: false
      t.boolean :webhooks_enabled, default: false
      t.string :account_label
      t.string :property_label
    end
  end
end
