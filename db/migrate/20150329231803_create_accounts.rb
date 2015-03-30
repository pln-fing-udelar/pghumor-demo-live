class CreateAccounts < ActiveRecord::Migration
  def self.up
    create_table :accounts do |t|
      t.column :name, :string
      t.column :image_path, :string
      t.column :description, :string
    end
    execute "ALTER TABLE accounts ROW_FORMAT=COMPRESSED;"
  end

  def self.down
    drop_table :accounts
  end
end
