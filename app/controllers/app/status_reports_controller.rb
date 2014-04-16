class App::StatusReportsController < ApplicationController
  before_action :authenticate_user!
  before_action :set_status_report, only: [:show, :edit, :update, :destroy, :publish]

  # GET /status_reports
  def index
    @status_reports = StatusReport.all.order(created_at: :desc)
  end

  # GET /status_reports/1
  def show
    @feed_items = FeedItem.where(author: current_user).where(timestamp: (@status_report.status_date.midnight - 1.day)..@status_report.status_date.midnight)
  end

  # GET /status_reports/new
  def new
    @status_report = StatusReport.find_or_create_by(status_date: Date.today, user_id: current_user.id)
    @feed_items = FeedItem.where(author: current_user).where(timestamp: (@status_report.status_date.midnight - 1.day)..@status_report.status_date.midnight)
  end

  # GET /status_reports/1/edit
  def edit
  end

  # POST /status_reports
  def create
    @status_report = StatusReport.new(status_report_params)

    if @status_report.save
      redirect_to @status_report, notice: 'Status report was successfully created.'
    else
      render action: 'new'
    end
  end

  def publish
    @status_report.publish!

    if @status_report.published?
      redirect_to @status_report, notice: 'Status report was successfully created.'
    else
      render action: 'new'
    end
  end

  # PATCH/PUT /status_reports/1
  def update
    if @status_report.update(status_report_params)
      redirect_to @status_report, notice: 'Status report was successfully updated.'
    else
      render action: 'edit'
    end
  end

  # DELETE /status_reports/1
  def destroy
    @status_report.destroy
    redirect_to status_reports_url, notice: 'Status report was successfully destroyed.'
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_status_report
      @status_report = StatusReport.find(params[:id])
    end

    # Only allow a trusted parameter "white list" through.
    def status_report_params
      params[:status_report]
    end
end
