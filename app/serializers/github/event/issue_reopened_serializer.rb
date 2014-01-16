class Github::Event::IssueReopenedSerializer < TextItemSerializer
  
  def property
		object.repo_name.capitalize
	end

	def action
		"Issue Reopened"
	end

	def body
		body = object.title
		body +=  "\n#{object.body_text}" unless object.body_text.nil?
		body += "\n\n" if (!object.body_text.nil? && object.assigned_to_name)
		body += "Assigned to #{object.assigned_to_name}" if object.assigned_to_name
		return body
	end
end
