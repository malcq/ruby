class AddSlugToPhrases < ActiveRecord::Migration[5.2]
  def change
    add_column :phrases, :slug, :string, unique: true
  end
end
