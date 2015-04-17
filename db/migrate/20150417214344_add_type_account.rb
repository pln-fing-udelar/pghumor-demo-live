class AddTypeAccount < ActiveRecord::Migration
  def self.up
    add_column :accounts, :is_humor, :boolean, default: 0
  end

  def self.down
    remove_column :accounts, :is_humor
  end
end
