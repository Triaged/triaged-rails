class Github::Event::IssueOpenedSerializer < TextItemSerializer
	#attributes  :title, :opened_by_name, :assigned_to_name, :body, :html_url

	def property
		object.repo_name.capitalize
	end

	def action
		object.title
	end

	def body
		body = object.body_text.nil? ? " " : object.body_text 
		body += "\n\n" if (!object.body_text.nil? && object.assigned_to_name)
		body += "Assigned to #{object.assigned_to_name}" if object.assigned_to_name
		return body
	end
end