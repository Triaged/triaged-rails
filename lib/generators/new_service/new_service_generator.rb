class NewServiceGenerator < Rails::Generators::Base
  source_root File.expand_path('../templates', __FILE__)
  argument :service_name, :type => :string
  argument :events, type: :array, default: [], banner: "event event"

  def create_initializer_file
    create_file "config/initializers/#{service_name}.rb", "# Add initialization content here"
  end

  def create_service_controller
    create_file "app/controllers/services/#{service_name}_controller.rb", "class Services::#{service_name.camelize}Controller < ServiceController end"
  end

  def create_webhook_service
    create_file "app/services/#{service_name}/webhook_service.rb", "class #{service_name.camelize}::WebhookService < Service end"
  end

  def create_model_stubs
  	events.each do |event|
  		create_file "app/models/#{service_name}/event/#{event}.rb", "class #{service_name.camelize}::Event::#{event.camelize} < FeedItem end"
  	end
  end

  def create_serializer_stubs
  	events.each do |event|
  		create_file "app/serializers/#{service_name}/event/#{event}_serializer.rb", "class #{service_name.camelize}::Event::#{event.camelize}Serializer < FeedItemSerializer end"
  	end
  end


end
