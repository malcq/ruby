class NotificationsController < ApplicationController
  skip_before_action :verify_authenticity_token

  def index
    @notifications = PublicActivity::Activity.where(recipient_id: current_user.id)
  end

  def read_all
    current_user.all_is_readed
    render json: {}
  end
end
