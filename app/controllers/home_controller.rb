class HomeController < ApplicationController

  def index
    @tweets = Tweet.obtener(20, -1)
  end
end
