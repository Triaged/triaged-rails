CarrierWave.configure do |config|
  config.fog_credentials = {
    # Configuration for Amazon S3 should be made available through an Environment variable.
    # For local installations, export the env variable through the shell OR
    # if using Passenger, set an Apache environment variable.
    #
    # In Heroku, follow http://devcenter.heroku.com/articles/config-vars
    #
    # $ heroku config:add S3_KEY=your_s3_access_key S3_SECRET=your_s3_secret S3_REGION=eu-west-1 S3_ASSET_URL=http://assets.example.com/ S3_BUCKET_NAME=s3_bucket/folder
 
    # Configuration for Amazon S3
    :region                 => 'eu-west-2',
    :provider              => 'AWS',
    :aws_access_key_id     => ENV['AWS_ACCESS_KEY_ID'],
    :aws_secret_access_key => ENV['AWS_SECRET_ACCESS_KEY']
  }
 
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
 
  config.cache_dir = "#{Rails.root}/tmp/uploads"                  # To let CarrierWave work on heroku
  config.fog_directory    = ENV['FOG_DIRECTORY']
  #config.s3_access_policy = :public_read                          # Generate http:// urls. Defaults to :authenticated_read (https://)
  #config.fog_host         = "#{ENV['S3_ASSET_URL']}/#{ENV['FOG_DIRECTORY']}"
end

# config/initializers/carrierwave.rb
CarrierWave.configure do |config|
  config.cache_dir = "#{Rails.root}/tmp/uploads"       

  config.fog_credentials = {
    :provider               => 'AWS',                        # required
    :aws_access_key_id      =>  ENV['AWS_ACCESS_KEY_ID'],
    :aws_secret_access_key  =>  ENV['AWS_SECRET_ACCESS_KEY']
    :region                 => 'eu-west-2',                  # optional, defaults to 'us-east-1'
    :host                   => "//#{ENV['FOG_DIRECTORY']}.s3.amazonaws.com",             # optional, defaults to nil
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