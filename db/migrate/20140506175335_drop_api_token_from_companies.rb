class DropApiTokenFromCompanies < ActiveRecord::Migration
  def change
  	remove_column :companies, :api_token
  end
end
