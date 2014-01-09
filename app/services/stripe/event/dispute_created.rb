class Stripe::Event::DisputeCreated < Stripe::BaseEvent
  
   def self.build_from_webhook data, company
		event = {
			type: :event,
			company_id: company.id,
			provider_name: provider_name,
			title: "Dispute #{data.data.object.status.humanize}",
			provider_account_name: nil,
			should_push: true,
			external_id: data.id,
			property_name: nil,
			description: data.data.object.reason,
			footer: "#{ActionView::Base.new.number_to_currency(data.data.object.amount  / 100)}, Due By: #{data.data.object.evidence_due_by}",
			timestamp: DateTime.strptime(data.created.to_s,'%s'),
			url: build_html_url(data.id),
		}
		return event.to_json
	end

	def build_html_url(id)
		base_url_path + "/payments/#{id}"
	end

end
