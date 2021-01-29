class ApplicationController < ActionController::Base
  protect_from_forgery with: :exception
  before_action :configure_permitted_parameters, if: :devise_controller?
  before_action :authenticate_user!
  before_action :forbid_user_vote!, only: [:vote]

  protected

  def configure_permitted_parameters
    added_attrs = %i(username email password password_confirmation remember_me avatar avatar_cache)
    devise_parameter_sanitizer.permit :sign_up, keys: added_attrs
    devise_parameter_sanitizer.permit :account_update, keys: added_attrs
  end

  def shared_vote(instance)
    params[:vote] == 'up' ? instance.liked_by(current_user) : instance.downvote_from(current_user)

    NotificationsMailer.mailer(instance).deliver if instance.get_upvotes.size % 5 == 0

    if instance.vote_registered?
      instance.add_carma(params[:vote], current_user)
      message = params[:vote] == 'up' ? 'Liked your' : 'Disliked your'
      instance.create_activity key: message, owner: current_user, recipient: instance.user
      flash[:success] = 'Thank you, for your vote!'
    else
      flash[:danger] = 'You are already voted, sorry'
    end
  end

  def forbid_user_vote!
      if params[:controller] == 'examples'
        phrase = Phrase.friendly.find(params[:phrase_id])
        forbidden_user = phrase.examples.friendly.find(params[:example_id]).user == current_user
      else
        forbidden_user = Phrase.friendly.find(params[:id]).user == current_user
      end

      if forbidden_user
          flash[:danger] = "You can't vote yourself, sorry"
          redirect_back(fallback_location: root_path)
      end
  end
end
