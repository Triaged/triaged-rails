class Provider
  include Mongoid::Document
  

  field :name, :type => String
  
  def self.named name
  	Provider.where(name: name).first
  end
 

end
