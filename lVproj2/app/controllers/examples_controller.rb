class ExamplesController < ApplicationController
  before_action :set_phrase!, only: [:create, :destroy, :vote]
  before_action :set_example!, only: [:destroy, :vote]
  before_action :check_user_before_example_deletion!, only: [:destroy]

  def create
    @example = @phrase.examples.new(examples_params)

    if @example.save
      flash[:success] = 'Example has been created'
    else
      flash[:danger] = @example.errors.full_messages.to_sentence
    end

    redirect_to phrase_path(@phrase)
  end

  def vote
    shared_vote(@example)
    redirect_back(fallback_location: root_path)
  end

  def destroy
    if @phrase.examples.count > 1
      @example.destroy
      flash[:success] = 'Example has been destroyed'
    else
      flash[:danger] = 'U cannot delete last example'
    end
    redirect_to phrase_path(@phrase)
  end

  private
  def examples_params
    params.require(:example).permit(:example, :user_id)
  end

  def set_phrase!
    @phrase = Phrase.friendly.find(params[:phrase_id])
  end

  def set_example!
    example_id = params[:example_id].nil? ? params[:id] : params[:example_id]
    @example = @phrase.examples.friendly.find(example_id)
  end

  def check_user_before_example_deletion!
    unless @example.user == current_user
      flash[:danger] = "U can't delete not your own example"
      redirect_back(fallback_location: root_path)
    end
  end
end
