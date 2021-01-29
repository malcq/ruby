Rails.application.routes.draw do
  root 'phrases#index', as: :root
  devise_for :users
  get '/static_pages/hello'

  resources :users

  resources :notifications, only: :index do
    collection do
      put :read_all
    end
  end

  resources :phrases do
    member do
      post :vote
    end

    resources :examples, only: [:create, :destroy] do
      post :vote
    end
  end
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
end
