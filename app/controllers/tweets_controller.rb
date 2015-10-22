class TweetsController < ApplicationController
  def show
    tweets = Tweet.obtener(params[:count].to_i, params[:id].to_i)
    render json: { tweets: tweets }, include: :account
  end
end
