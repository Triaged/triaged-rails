class Admin::MessagesController < ApplicationController

	def index
		@mentions = Admin::MentionMessage.all
	end

	def show
		@mention = Admin::MentionMessage.find(params[:id])
	end
end
