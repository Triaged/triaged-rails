class Github::Event::IssueOpenedSerializer < TextItemSerializer
	#attributes  :title, :opened_by_name, :assigned_to_name, :body, :html_url

	def property
		object.repo.name
	end

	def action
		"@todo"
	end

	def body
		[object.title, object.body]
	end
end