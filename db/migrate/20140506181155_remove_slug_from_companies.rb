class RemoveSlugFromCompanies < ActiveRecord::Migration
  def change
  	remove_column :companies, :slug
  end
end
