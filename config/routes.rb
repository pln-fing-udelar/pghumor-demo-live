Rails.application.routes.draw do

  root to: 'home#index'

  get '/tweets/:id/:count', to: 'tweets#show'
end
