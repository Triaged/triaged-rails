class Admin::ProvidersController < ApplicationController
  before_action :authenticate_admin!
  before_action :set_admin_provider, only: [:show, :edit, :update, :destroy]

  # GET /admin/providers
  def index
    @admin_providers = Provider.all
  end

  # GET /admin/providers/1
  def show
  end

  # GET /admin/providers/new
  def new
    @admin_provider = Provider.new
  end

  # GET /admin/providers/1/edit
  def edit
  end

  # POST /admin/providers
  def create
    @admin_provider = Provider.new(admin_provider_params)

    if @admin_provider.save
      redirect_to admin_provider_path(@admin_provider), notice: 'Provider was successfully created.'
    else
      render action: 'new'
    end
  end

  # PATCH/PUT /admin/providers/1
  def update
    if @admin_provider.update(admin_provider_params)
      redirect_to admin_provider_path(@admin_provider), notice: 'Provider was successfully updated.'
    else
      render action: 'edit'
    end
  end

  # DELETE /admin/providers/1
  def destroy
    @admin_provider.destroy
    redirect_to admin_providers_url, notice: 'Provider was successfully destroyed.'
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_admin_provider
      @admin_provider = Provider.find(params[:id])
    end

    # Only allow a trusted parameter "white list" through.
    def admin_provider_params
      params[:admin_provider]
    end
end
