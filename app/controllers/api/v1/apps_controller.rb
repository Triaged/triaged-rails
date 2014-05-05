class Api::V1::AppsController < API::BaseController
	before_action :set_app, only: [:show, :edit, :update, :destroy, :feed]

  # GET /api/v1/apps
  def index
    @apps = current_company.company_apps.all
    respond_with @apps
  end

  # GET /api/v1/apps/1
  def show
    respond_with @app
  end

  def feed
    @feed_items = @app.feed(params[:min_updated_at], params[:max_updated_at])
    respond_with @feed_items
  end

  # GET /api/v1/apps/new
  def new
    @app = current_company.company_apps.build
    respond_with @app
  end

  # GET /api/v1/apps/1/edit
  def edit
  end

  # POST /api/v1/apps
  def create
    @app = current_company.company_apps.build(app_params)

    if @app.save
      redirect_to api_v1_apps_path(@app), notice: 'App was successfully created.'
    else
      render :new
    end
  end

  # PATCH/PUT /api/v1/apps/1
  def update
    if @app.update(app_params)
      redirect_to api_v1_apps_path(@app), notice: 'App was successfully updated.'
    else
      render :edit
    end
  end

  # DELETE /api/v1/apps/1
  def destroy
    @api_v1_app.destroy
    redirect_to api_v1_apps_url, notice: 'App was successfully destroyed.'
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_app
      @app = current_company.company_apps.find(params[:id])
    end


    # Only allow a trusted parameter "white list" through.
    def app_params
      params[:app].permit(:name)
    end
end
