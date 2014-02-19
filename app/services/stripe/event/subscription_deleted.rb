# class Stripe::Event::SubscriptionDeleted< Stripe::BaseEvent


#   field :plan_name, :type => String
#   field :interval, :type => String
#   field :plan_id, :type => DateTime
  

#   def self.create_from_webhook data
#   	event = Stripe::Event::SubscriptionDeleted.new(
#   		amount: (data.data.object.plan.amount / 100),
#   		plan_name: data.data.object.plan.name,
# 			interval: data.data.object.plan.interval,
# 			plan_id: data.data.object.plan.id,
# 		 	external_id: data.id,
# 		 	customer_id: data.data.object.customer,
# 		 	timestamp: DateTime.strptime(data.created.to_s,'%s')
# 		)
#   end

#   def build_html_url
# 		self.html_url = base_url_path + env_path + "/customers/#{customer_id}"
# 	end

# end
