class AddVotesToTweets < ActiveRecord::Migration
  def self.up
    add_column :tweets, :positive_votes, :integer, default: 0
    add_column :tweets, :negative_votes, :integer, default: 0
  end

  def self.down
    remove_column :tweets, :positive_votes
    remove_column :tweets, :negative_votes
  end
end
