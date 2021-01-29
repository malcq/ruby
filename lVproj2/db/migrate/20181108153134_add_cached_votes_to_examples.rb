class AddCachedVotesToExamples < ActiveRecord::Migration[5.2]
  def change
    change_table :examples do |t|
      add_column :examples, :cached_votes_total, :integer, :default => 0
      add_column :examples, :cached_votes_score, :integer, :default => 0
      add_column :examples, :cached_votes_up, :integer, :default => 0
      add_column :examples, :cached_votes_down, :integer, :default => 0
      add_index  :examples, :cached_votes_total
      add_index  :examples, :cached_votes_score
      add_index  :examples, :cached_votes_up
      add_index  :examples, :cached_votes_down
    end
  end
end
