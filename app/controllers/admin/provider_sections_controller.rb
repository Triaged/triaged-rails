class Admin::ProviderSectionsController < ApplicationController
  before_action :set_admin_provider_section, only: [:show, :edit, :update, :destroy]

  # GET /admin/provider_sections
  def index
    @admin_provider_sections = ProviderSection.all
  end

  # GET /admin/provider_sections/1
  def show
  end

  # GET /admin/provider_sections/new
  def new
    @admin_provider_section = ProviderSection.new
  end

  # GET /admin/provider_sections/1/edit
  def edit
  end

  # POST /admin/provider_sections
  def create
    @admin_provider_section = ProviderSection.new(admin_provider_section_params)

    if @admin_provider_section.save
      redirect_to admin_provider_section_path(@admin_provider_section), notice: 'Provider section was successfully created.'
    else
      render :new
    end
  end

  # PATCH/PUT /admin/provider_sections/1
  def update
    if @admin_provider_section.update(admin_provider_section_params)
      redirect_to admin_provider_section_path(@admin_provider_section), notice: 'Provider section was successfully updated.'
    else
      render :edit
    end
  end

  # DELETE /admin/provider_sections/1
  def destroy
    @admin_provider_section.destroy
    redirect_to admin_provider_sections_url, notice: 'Provider section was successfully destroyed.'
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_admin_provider_section
      @admin_provider_section = ProviderSection.find(params[:id])
    end

    # Only allow a trusted parameter "white list" through.
    def admin_provider_section_params
      params[:provider_section].permit(:name)
    end
end
