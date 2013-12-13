class Github::Event::IssueOpenedSerializer < TextItemSerializer
	#attributes  :title, :opened_by_name, :assigned_to_name, :body, :html_url

	def property
		object.repo_name.capitalize
	end

	def action
		object.title
	end

	def body
		Rails.logger.info "BODY----"
		Rails.logger.info object.body_text.nil?
		body = object.body_text.nil? ? "---" : object.body_text 
		Rails.logger.info body
		body += "\n\nAssigned to #{object.assigned_to_name}" if object.assigned_to_name
		return body
	end
end