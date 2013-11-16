require 'sidekiq/web'
DockedRails::Application.routes.draw do
  
	# To be removed
	resource :account


	devise_for :users, path_names: {sign_in: "login", sign_out: "logout"},
                   controllers: {omniauth_callbacks: "omniauth_callbacks"}

  # API Routes
  namespace :api do
    namespace :v1 do
    	devise_for :users
    	resource :account do
    		member do
    			get 'team'
    			post 'avatar'
    			post 'resend_verify_email'
    		end
    		resources :push_tokens do
    			collection do
    				post 'reset_count'
    			end
    		end
    	end
    	resources :feed do
    		resources :share
    		resources :messages
    		collection do 
    			get 'mock'
    			get 'view'
    		end
    	end
    	resources :providers do
    		member do
    			post 'ignore'
    			post 'follow'
    			post 'email_connect_instructions'
    		end
    	end
    	resources :provider_accounts do
  			resources :provider_properties do
  				member do
  					post 'ignore'
  					post 'follow'
  				end
  			end
  		end
    end
  end

  # Webhooks
	scope module: 'services' do
		[:sentry, :new_relic, :kiln, :airbrake, :heroku, :hockey_app].each do |resource|
  		resources resource do
  			member do
    			post '' => "#{resource}#webhook", as: 'webhook'
    			get '' => "#{resource}#redirect_to_root"
    		end
  		end
		end
  	resources :github do
  		member do
  			post '' => "github#webhook", as: 'webhook'
  			get '' => "#{resource}#redirect_to_root"
  			get 'org_list'
  			post 'set_default_org'
  		end
  	end
  	resources :stripe
  end
	
	get '/services/authenticate_for/:provider' => 'service#authenticate_for_oauth'
	get '/services/oauth_complete' => 'service#oauth_complete', as: 'oauth_complete'
	get '/services/oauth_failure/:error' => 'service#oauth_failure', as: 'oauth_failure'

	# Verification link
	get '/verify/:id/:token' => 'verify#show', as: 'verify_email'

	root :to => 'welcome#index'

	

	mount Sidekiq::Web => '/sidekiq'
	#mount Resque::Server, :at => "/resque"
	
end
