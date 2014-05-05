class CreateCompanyApps < ActiveRecord::Migration
  def change
    create_table :company_apps do |t|
      t.string :name
      t.references :company, index: true

      t.timestamps
    end
  end
end
