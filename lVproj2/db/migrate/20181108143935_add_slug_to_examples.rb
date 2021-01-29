class AddSlugToExamples < ActiveRecord::Migration[5.2]
  def change
    add_column :examples, :slug, :string, unique: true
  end
end
