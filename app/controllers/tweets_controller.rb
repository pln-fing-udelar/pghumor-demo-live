class TweetsController < ApplicationController
  def show
    tweets = Tweet.obtener(params[:count], params[:id])
    render json: { tweets: tweets }, include: :account
  end
end
