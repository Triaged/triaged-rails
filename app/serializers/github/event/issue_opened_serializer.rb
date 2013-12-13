class Github::Event::IssueOpenedSerializer < TextItemSerializer
	#attributes  :title, :opened_by_name, :assigned_to_name, :body, :html_url

	def property
		object.repo_name.capitalize
	end

	def action
		object.title
	end

	def body
		Rails.logger.info object.body.nil?
		body = object.body.nil? ? " " : object.body
		Rails.logger.info body
		body += "\n\nAssigned to #{object.assigned_to_name}" if object.assigned_to_name
	end
end