class Tweet < ActiveRecord::Base
  belongs_to :account

  def self.obtener(count, id_min)
    Tweet.where("id > #{id_min}").take(count)
  end
end
