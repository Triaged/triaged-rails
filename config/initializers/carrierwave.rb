# config/initializers/carrierwave.rb
CarrierWave.configure do |config|
  config.cache_dir = "#{Rails.root}/tmp/uploads"       

  config.fog_credentials = {
    :provider               => 'AWS',                        # required
    :aws_access_key_id      =>  ENV['AWS_ACCESS_KEY_ID'],
    :aws_secret_access_key  =>  ENV['AWS_SECRET_ACCESS_KEY']
    :region                 => 'eu-west-2',                  # optional, defaults to 'us-east-1'
    :host                   => "//#{ENV['FOG_DIRECTORY']}.s3.amazonaws.com"             # optional, defaults to nil
  }
  config.fog_directory  = ENV['FOG_DIRECTORY']                             # required
  #config.fog_public     = false                                   # optional, defaults to true
  config.fog_attributes = {'Cache-Control'=>'max-age=315576000'}  # optional, defaults to {}


  # For testing, upload files to local `tmp` folder.
  if Rails.env.test? || Rails.env.cucumber?
    config.storage = :file
    config.enable_processing = false
    config.root = "#{Rails.root}/tmp"
  end
  if Rails.env.development?
	  CarrierWave.configure do |config|
	    config.storage = :file
	  end
	end
	if Rails.env.production? || Rails.env.staging?
	  CarrierWave.configure do |config|
	    config.storage = :fog
	  end
	end
end