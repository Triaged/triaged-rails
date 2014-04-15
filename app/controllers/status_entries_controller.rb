class StatusEntriesController < ApplicationController
  respond_to :html, :js

  before_action :set_status_report
  before_action :set_status_entry, only: [:show, :edit, :update, :destroy]

  # GET /status_entries
  def index
    @status_entries = @status_report.status_entries.all
  end

  # GET /status_entries/1
  def show
  end

  # GET /status_entries/new
  def new
    @status_entry = @status_report.status_entries.build
  end

  # GET /status_entries/1/edit
  def edit
  end

  # POST /status_entries
  def create
    @status_entry = @status_report.status_entries.build(status_entry_params)
    flash[:notice] = 'Success' if @status_entry.save
    respond_with @status_entry
  end

  # PATCH/PUT /status_entries/1
  def update
    if @status_entry.update(status_entry_params)
      redirect_to @status_entry, notice: 'Status entry was successfully updated.'
    else
      render action: 'edit'
    end
  end

  # DELETE /status_entries/1
  def destroy
    @status_entry.destroy
    redirect_to status_entries_url, notice: 'Status entry was successfully destroyed.'
  end

  private
    def set_status_report
      @status_report = StatusReport.find(params[:status_report_id])
    end

    # Use callbacks to share common setup or constraints between actions.
    def set_status_entry
      @status_entry = @status_report.status_entries.find(params[:id])
    end

    # Only allow a trusted parameter "white list" through.
    def status_entry_params
      params[:status_entry].permit(:body)
    end
end
