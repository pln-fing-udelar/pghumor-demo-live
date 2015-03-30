class CreateTweets < ActiveRecord::Migration
  def self.up
    create_table :tweets do |t|
      t.column :text, :string
      t.column :is_humor, :boolean
      t.column :is_classified, :boolean
      t.column :account_id, :integer
    end
    execute "ALTER TABLE tweets ROW_FORMAT=COMPRESSED;"
  end

  def self.down
    drop_table :tweets
  end
end
