class AddOauthPathToProviders < ActiveRecord::Migration
  def change
    add_column :providers, :oauth_path, :string
  end
end
