class CreatePhrases < ActiveRecord::Migration[5.2]
  def change
    create_table :phrases do |t|
      t.string :phrase
      t.string :translation

      t.timestamps
    end
  end
end
