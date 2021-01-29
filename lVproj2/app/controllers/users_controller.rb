class UsersController < ApplicationController

  def index

    @users = User.order(carma: :desc).paginate(page: params[:page])
  end

  def new
    @user = User.new
  end

  def edit

  end

  def show
    @user = User.friendly.find(params[:id])
    @phrases =  @user.phrases
  end
end
