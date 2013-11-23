namespace :migration do
  desc "TODO"
  

  task run: :environment do

  	companies = Company.all
  	companies.each do |company|
  		company.feed_items.each do |feed_item|
  			new_feed_item = NewFeedItem.create(feed_item)
  			feed_item.follower_feed_items.each do |user_feed_item|
  				user_feed_item.new_feed_item = new_feed_item
  				user_feed_item.save!
  			end
			end
  	end
  	
  end

end


# Steps
#1 Loop through companies
#2 loop through feed items
#3 create a new feed item from the old one
#4 add new_feed_item_id to each user_feed_item

# then
# 
