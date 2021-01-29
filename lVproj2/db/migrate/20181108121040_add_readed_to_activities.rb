class AddReadedToActivities < ActiveRecord::Migration[5.2]
  def change
    add_column :activities, :readed, :boolean, default: false
  end
end
