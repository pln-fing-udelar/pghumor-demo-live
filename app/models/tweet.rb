class Tweet < ActiveRecord::Base
  include Comparable

  HASHTAG_IDM = '#IdM2015'

  belongs_to :account

  def self.obtener(count, id_min)
    tweets = Tweet.where("id > #{id_min} AND (is_classified IS NULL OR is_classified = 1)").order('id DESC').limit(count)
    tweets
  end

  def star_average
    if positive_votes + negative_votes == 0
      0
    else
      (one_star + 2*two_star + 3*three_star + 4*four_star + 5*five_star)*1.0/(positive_votes + negative_votes)
    end
  end

  def <=>(another)
    if id_tweet == another.id_tweet
      0
    elsif retweet_count == another.retweet_count
      if favorite_count == another.favorite_count
        text <=> another.text
      else
        favorite_count <=> another.favorite_count
      end
    else
      retweet_count <=> another.retweet_count
    end
  end
end
