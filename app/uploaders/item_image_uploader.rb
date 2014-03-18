# encoding: utf-8

class ItemImageUploader < CarrierWave::Uploader::Base
  include Cloudinary::CarrierWave

 
  version :web do
    #eager
    cloudinary_transformation :transformation => [{:width => 600, :crop => :limit}]
  end

  version :ios do
    #eager
    cloudinary_transformation :transformation => [{:width => 600, :height => 460, :crop => :limit}]
  end
  

end
