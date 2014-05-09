class ProvidersController < WebController
	include OauthGateway

	before_filter :set_provider, :except => [:index]
	before_filter :validate_oauth, :only => :show
	before_filter :check_connected, :only => [:show]


	def index
		@providers = Provider.active
	end

	def show
		@provider_account = @app.provider_account_for @provider
	end

	def settings
		@provider_account = @app.provider_account_for @provider
	end

	# PATCH/PUT /app/applications/1
  def update
  	if @provider.update(provider_params)
      redirect_to app_provider_path(@app, @provider), notice: 'Provider was successfully updated.'
    else
      render :edit
    end
  end

	def webhook_settings

	end


private
	def set_provider
		@provider = Provider.find(params[:id])
	end
	
	def check_connected
		return if @app.connected_to_provider? @provider

		if @provider.oauth
			redirect_to select_app_provider_accounts_path(@provider)
		else
			redirect_to webhook_settings_app_provider_path
		end
	end

	# Only allow a trusted parameter "white list" through.
    def provider_params
    	logger.info params[:provider]
    	p = params[:provider].permit(:provider_account_attributes => [:id, :provider_properties_attributes => [:active, :id]])
    	logger.info p
    	return p

    end

end
