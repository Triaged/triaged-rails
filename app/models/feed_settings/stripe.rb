class FeedSettings::Stripe
  include Mongoid::Document

  belongs_to :user

  def feed
  	true
  end
end
