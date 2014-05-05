class AddAppTypeToCompanyApps < ActiveRecord::Migration
  def change
    add_column :company_apps, :app_type, :integer, default: 0
  end
end
