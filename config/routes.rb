require 'sidekiq/web'
TriageRails::Application.routes.draw do
 
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
    			post 'welcome_complete'
    			post 'reset_password'
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
      resources :team do
        member do
          get 'feed'
        end
      end
    	resources :providers do
        collection do
          get 'connected'
        end
    		member do
    			post 'ignore'
    			post 'follow'
    			post 'email_connect_instructions'
          get 'feed'
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

  namespace :app do
    resources :feed_items
    resources :feed

    resources :share, :only => :show
    

    resources :providers do
      resources :provider_accounts do 
        collection do 
          get 'select'
          post 'set_account'
        end
      end
    end

  end

  # Webhooks
	scope module: 'services' do
		[:sentry, :new_relic, :kiln, :airbrake, :heroku, :hockey_app, :crashlytics, :beanstalk, :braintree, :bitbucket, :zapier, :trello].each do |resource|
  		resources resource do
  			collection do
    			post ':company_id' => "#{resource}#webhook", as: 'webhook'
          get 'validate' => "#{resource}#validate"
    		end
  		end
		end
  	resources :github do
  		collection do
  			get 'org_list'
  			post 'set_default_org'
  			post ':company_id' => "github#webhook", as: 'webhook'
  		end
  	end
    resources :stripe
  	resources :google_analytics do
  		collection do
  			get 'account_list'
  			post 'set_default_account'
  		end
  	end
  end



  get '/services/authenticate_for/:provider' => 'service#authenticate_for_oauth'
	get '/services/oauth_complete' => 'service#oauth_complete', as: 'oauth_complete'
	get '/services/oauth_failure/:error' => 'service#oauth_failure', as: 'oauth_failure'
	# Verification link
	get '/verify/:id/:token' => 'verify#show', as: 'verify_email'



	root :to => 'welcome#index'
	get '/support' => 'welcome#support', as: 'support'
  get 'play' => 'welcome#play'
	get '/terms' => 'welcome#terms', as: 'terms'
	get '/press' => 'welcome#press', as: 'press'
	get '/about' => 'welcome#about', as: 'about'
	post '/deliver_sms' => 'welcome#deliver_sms', as: 'deliver_sms'
	post '/capture_email' => 'welcome#capture_email', as: 'capture_email'
	

	devise_for :admins, :controllers => { :registrations => "admin_registrations" }
	authenticated :admin do
		namespace :admin do
			resources :welcome
			resources :messages
      resources :providers
			mount Sidekiq::Web => '/sidekiq'
		end
	end

	#mount Dashing::Engine, at: Dashing.config.engine_path
	
	#mount Resque::Server, :at => "/resque"
	
end
