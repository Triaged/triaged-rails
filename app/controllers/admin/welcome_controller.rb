class Admin::WelcomeController < AdminsController
	
	

	def index
		@user_count = User.count
		@unvalidated_users = User.where(validated_belongs_to_company: false).count
		@company_count = Company.count
		@feed_item_count = Company.all.sum {|company| company.feed_items.count}
		@connected_count = Company.all.sum {|company| company.connected_providers.count}
		@providers = provider_items
	end



	def connected_providers
	results = Company.collection.aggregate({ '$unwind' => "$connected_providers" },{ '$group' => { '_id' => "$connected_providers.provider_id" , 'number' => { '$sum' => 1 } } })
	return results
end

def provider_items
	results = connected_providers.collect {|provider|  { label: Provider.find(provider["_id"]).name, value: provider["number"] }}
	return results
end

end
