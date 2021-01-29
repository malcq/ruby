class PhrasesController < ApplicationController
  before_action :set_phrase!, only: [:edit, :update, :destroy, :show, :vote]
  before_action :check_user!, only: [:edit, :update, :destroy]

  def index
    @phrases = Phrase.includes(:user).paginate(page: params[:page], per_page: 5)
  end

  def new
    @phrase = Phrase.new
    @example = @phrase.examples.build(user_id: current_user.id)
  end

  def show
    @examples = @phrase.examples.includes(:user).order(cached_votes_up: :desc).paginate(page: params[:page], per_page: 5)
    @example = @phrase.examples.build(user_id: current_user.id)
  end


  def create
    @phrase = current_user.phrases.new(phrase_params)

    if @phrase.save
      flash[:success] = 'Phrase has been created'
      redirect_to root_path
    else
      flash[:danger] = @phrase.errors.full_messages.to_sentence
      render :new
    end
  end

  def edit

  end

  def vote
    shared_vote(@phrase)
    redirect_back(fallback_location: root_path)
  end

  def update
      if @phrase.update_attributes(phrase_params)
        flash[:success] = 'Phrase has been updated'
        redirect_to root_path
      else
        flash[:danger] = @phrase.errors.full_messages.to_sentence
        render :new
      end
  end

  def destroy
    @phrase.destroy
    flash[:success] = 'Phrase has been deleted'
    redirect_to root_path
  end

  private
  def phrase_params
    params.require(:phrase).permit(:phrase, :translation, :category, examples_attributes: [:example, :user_id, :_destroy])
  end

  def set_phrase!
    @phrase = Phrase.friendly.find(params[:id])
  end

  def check_user!
    unless @phrase.is_author? current_user
      flash[:danger] = 'You don\'t author of this phrase, sorry'
      redirect_back(fallback_location: root_path)
    end
  end
end
