class Stripe::Event::SubscriptionDeleted< Stripe::BaseEvent
  include Mongoid::Document

  field :plan_name, :type => String
  field :interval, :type => String
  field :plan_id, :type => DateTime
  field :customer_name, :type => String
  field :customer_email, :type => String
  

  def self.create_from_webhook event
  	data = event.data.object
  	event = Stripe::Event::SubscriptionDeleted.new(
  		amount: data.data.object.plan.amount,
  		plan_name: data.data.object.plan.name,
			interval: data.data.object.plan.interval,
			plan_id: data.data.object.plan.id,
		 	external_id: data.id,
		 	customer_id: data.data.object.customer,
		 	timestamp: DateTime.strptime(data.created,'%s')
		)
  end

  def build_html_url
		self.html_url = base_url_path + env_path + "/customers/#{customer_id}"
	end

end
