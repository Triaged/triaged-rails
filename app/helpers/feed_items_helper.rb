module FeedItemsHelper

	def avatar_for user, provider
		content_tag(:div, class: "as-image") do
			if user && user.avatar?
				image_tag("team/alex.png", :width => "62", :id => "lgicon") + image_tag(provider.small_icon.url, :width => "26", :id => "smicon")
			else
				image_tag(provider.large_icon.url, :width => "62", :id => "lgicon")
			end
		end
	end

	def body_helper event
		unless event.body.nil?
			content_tag(:p, event.body)
		else
			content_tag(:ul, class: "body-list") do
				event.body_list.collect {|body| concat(content_tag(:li, body))}
			end
		end
	end

	# def title_for user, title
	# 	content_tag(:div, class: "headcontent") do
	# 		if user


	# 		else
	# 			content_tag(:h2, event.title, class: "title")
	# 		end

	# end


	# 	<div class="">
	# 				<h2 class="author"><%= event.user.name %></h2>
	# 				<h2 class="title"><%= %></h2>
	# 			</div>
		

	
end
