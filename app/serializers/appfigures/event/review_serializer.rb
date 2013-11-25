class Appfigures::Event::ReviewSerializer < TextItemSerializer
	def property
		object.app.name
	end

	def action
		"#{object.title} - #{object.stars}/5"
	end

	def body
		"#{object.review.sanitize}\n\nby #{object.author.titleize}"
	end
end