class Appfigures::ProductService < Appfigures::BaseService

	def find_or_create_product product_id
		product = @company.default_appfigures_account.provider_properties.where(external_id: product_id).first

		product = fetch_product(product_id) unless product
			
		Rails.logger.info product
		return product
	end

	def fetch_product product_id
		result = RestClient.get "https://api.appfigures.com/v2/products/#{product_id}", headers
		product = create_product JSON.parse(result)
	end

	def create_product result
		new_product = RecursiveOpenStruct.new(result)

		product = @company.default_appfigures_account.provider_properties << Appfigures::Product.create(
			name: new_product.name,
			external_id:  new_product.id,
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
		
		return product
	end

end