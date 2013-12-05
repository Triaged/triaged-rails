

def connected_providers
	results = Company.collection.aggregate({ '$unwind' => "$connected_providers" },{ '$group' => { '_id' => "$connected_providers.provider_id" , 'number' => { '$sum' => 1 } } })
	Rails.logger.info results
	return results
end

def provider_items
	results = connected_providers.collect {|provider|  { label: Provider.find(provider["_id"]).name, value: provider["number"] }}
		Rails.logger.info results
		return results
end

Dashing.scheduler.every '5m', first_in: 1.second.since do
 	Dashing.send_event('current_users', { current: User.count })
  Dashing.send_event('company_count', { current: Company.count })
  Dashing.send_event('unvalidated_users', { current: User.where(validated_belongs_to_company: false).count })
  Dashing.send_event('synergy',   { value: rand(100) })
  Dashing.send_event('connected_providers',  {items: provider_items})
end


# 		@feed_item_count = Company.all.sum {|company| company.feed_items.count}
# 		@connected_count = Company.all.sum {|company| company.connected_providers.count}