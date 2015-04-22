class AddStarVotesToTweet < ActiveRecord::Migration
  def self.up
    add_column :tweets, :one_star, :int, default: 0
    add_column :tweets, :two_star, :int, default: 0
    add_column :tweets, :three_star, :int, default: 0
    add_column :tweets, :four_star, :int, default: 0
    add_column :tweets, :five_star, :int, default: 0
  end

  def self.down
    remove_column :tweets, :one_star
    remove_column :tweets, :two_star
    remove_column :tweets, :three_star
    remove_column :tweets, :four_star
    remove_column :tweets, :five_star
  end
end
