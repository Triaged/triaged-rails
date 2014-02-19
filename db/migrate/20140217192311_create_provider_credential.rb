class CreateProviderCredential < ActiveRecord::Migration
  def change
    create_table :provider_credentials do |t|
      t.references :user
      t.references :provider
      t.references :company
      t.string :uid
      t.string :access_token
      t.string :token_secret
      t.string :refresh_token
    end
  end
end
