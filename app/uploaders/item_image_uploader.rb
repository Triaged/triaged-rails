# encoding: utf-8

class ItemImageUploader < CarrierWave::Uploader::Base
  include Cloudinary::CarrierWave

 
 
  version :ios do
    #eager
    cloudinary_transformation :width => 600, :height => 600, :crop => :fit
  end
  

end
