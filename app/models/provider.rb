class Provider
  include Mongoid::Document
  

  field :name, :type => String

  validates :name, uniqueness: true
  
  def self.named name
  	Provider.where(name: name).first
  end
 

end
