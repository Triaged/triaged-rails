class CreateTrigrams < ActiveRecord::Migration
  def change
    create_table :trigrams do |t|
    	extend Fuzzily::Migration
    end
  end
end
