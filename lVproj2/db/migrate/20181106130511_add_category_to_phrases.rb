class AddCategoryToPhrases < ActiveRecord::Migration[5.2]
  def change
    add_column :phrases, :category, :integer, default: 0
  end
end
