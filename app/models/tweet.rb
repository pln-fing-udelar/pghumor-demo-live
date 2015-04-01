class Tweet < ActiveRecord::Base
  belongs_to :account

  def self.obtener(count, id_min)
    tweets = Tweet.where("id > #{id_min} and is_classified = 1").order('id').take(count)
    puts tweets.inspect
    tweets
  end
end
