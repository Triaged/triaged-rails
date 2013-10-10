DockedRails::Application.routes.draw do
  resources :companies
	
	resource :account

  devise_for :users, path_names: {sign_in: "login", sign_out: "logout"},
                   controllers: {omniauth_callbacks: "omniauth_callbacks"}

  namespace :api do
    namespace :v1 do
    	devise_for :users
    	resource :account do
    		resources :push_tokens do
    			collection do
    				post 'reset_count'
    			end
    	end
    	resources :feed do
    		resources :messages
    		collection do 
    			get 'mock'
    			get 'view'
    		end
    	end
    end
  end


	constraints subdomain: /.+/ do
	  namespace :services do
	  	resources :github
	  	resources :sentry
	  	resources :new_relic
	  	resources :kiln
	  	resources :airbrake
	  end
	end

	namespace :services do
	  	resources :stripe
	  end
	
	get '/services/authenticate_for/:provider' => 'service#authenticate_for_oauth'
	get '/services/oauth_complete' => 'service#oauth_complete', as: 'oauth_complete'


  # The priority is based upon order of creation: first created -> highest priority.
  # See how all your routes lay out with "rake routes".

  # You can have the root of your site routed with "root"
  # root 'welcome#index'

  # Example of regular route:
  #   get 'products/:id' => 'catalog#view'

  # Example of named route that can be invoked with purchase_url(id: product.id)
  #   get 'products/:id/purchase' => 'catalog#purchase', as: :purchase

  # Example resource route (maps HTTP verbs to controller actions automatically):
  #   resources :products

  # Example resource route with options:
  #   resources :products do
  #     member do
  #       get 'short'
  #       post 'toggle'
  #     end
  #
  #     collection do
  #       get 'sold'
  #     end
  #   end

  # Example resource route with sub-resources:
  #   resources :products do
  #     resources :comments, :sales
  #     resource :seller
  #   end

  # Example resource route with more complex sub-resources:
  #   resources :products do
  #     resources :comments
  #     resources :sales do
  #       get 'recent', on: :collection
  #     end
  #   end
  
  # Example resource route with concerns:
  #   concern :toggleable do
  #     post 'toggle'
  #   end
  #   resources :posts, concerns: :toggleable
  #   resources :photos, concerns: :toggleable

  # Example resource route within a namespace:
  #   namespace :admin do
  #     # Directs /admin/products/* to Admin::ProductsController
  #     # (app/controllers/admin/products_controller.rb)
  #     resources :products
  #   end
end
