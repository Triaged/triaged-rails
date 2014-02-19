class Appfigures::AccountService < Appfigures::BaseService
	

	def fetch_accounts
		user = RestClient.get "https://api.appfigures.com/v2/", headers
		user = JSON.parse(user)
		
		account = RestClient.get "https://api.appfigures.com/v2/users/#{user["user"]["email"]}", headers
		account = JSON.parse(account)
		build_account(company, account["account"])
	end

	def fetch_properties(account)
		products = RestClient.get "https://api.appfigures.com/v2/products/mine", headers
		products = JSON.parse(products)
		products.each  {|product| create_product(product, account)}
	end

	def build_account company, account
		account = RecursiveOpenStruct.new(account)
		name = account.company || account.name
		company.provider_accounts.create(provider: Provider.named("appfigures"), name: name, external_id: account.id, default: true)
	end

	def create_product product, account
		new_product = RecursiveOpenStruct.new(result)

		product = Appfigures::Product.new(
			name: new_product.name,
			external_id:  new_product.id.to_s,
			developer: new_product.developer,
			icon: new_product.icon,
			vendor_identifier: new_product.vendor_identifier,
			ref_no: new_product.ref_no,
			sku: new_product.sku,
			store_id: new_product.store_id,
			store_name: new_product.store_name,
			version: new_product.version,
			type: new_product.type
			)
		
		account.provider_properties << product

		Rails.logger.info product.inspect

		return product
	end

end