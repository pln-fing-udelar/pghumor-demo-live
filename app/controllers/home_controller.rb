class HomeController < ApplicationController

  def index
    @tweets = Tweet.obtener(10, -1)
  end
end
