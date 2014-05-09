class AppsController < WebController
	before_action :set_app, only: [:show, :edit, :update, :destroy]

  # GET /app/applications
  def index
    @apps = @company.company_apps.all
  end

  # GET /app/applications/1
  def show
    @providers = Provider.active.all
  end

  # GET /app/applications/new
  def new
    @app = @company.company_apps.build
  end

  # GET /app/applications/1/edit
  def edit
  end

  # POST /app/applications
  def create
  	@app = @company.company_apps.build(app_params)

    if @app.save
      redirect_to app_path(@app), notice: 'Application was successfully created.'
    else
      render :new
    end
  end

  # PATCH/PUT /app/applications/1
  def update
    if @app.update(app_params)
      redirect_to app_path(@app), notice: 'Application was successfully updated.'
    else
      render :edit
    end
  end

  # DELETE /app/applications/1
  def destroy
    @app.destroy
    redirect_to app_url, notice: 'Application was successfully destroyed.'
  end

  private

  	# Use callbacks to share common setup or constraints between actions.
    def set_app
      @app = @company.company_apps.find(params[:id])
    end

    # Only allow a trusted parameter "white list" through.
    def app_params
    	logger.info params[:company_app]
      params[:company_app].permit(:name, :app_type)
    end
end
