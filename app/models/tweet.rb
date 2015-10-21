class Tweet < ActiveRecord::Base
  include Comparable

  HASHTAG_IDM = '#IdM2015'

  belongs_to :account

  def self.obtener(count, id_min)
    tweets = Tweet.where("id > #{id_min} and is_classified = 1").order('id').take(count)
    puts tweets.inspect
    tweets
  end

  def star_average
    puts (one_star + 2*two_star + 3*three_star + 4*four_star + 5*five_star)/(positive_votes + negative_votes)
    (one_star + 2*two_star + 3*three_star + 4*four_star + 5*five_star)*1.0/(positive_votes + negative_votes)
  end

  def <=>(another)
    if id_tweet == another.id_tweet
      0
    else
      text <=> another.text # TODO
    end
  end
end
