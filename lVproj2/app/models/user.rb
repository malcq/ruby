class User < ApplicationRecord
  mount_uploader :avatar, AvatarUploader
  include PublicActivity::Model
  extend FriendlyId

  has_many :phrases, dependent: :destroy
  has_many :examples, dependent: :destroy

  friendly_id :username, use: :slugged
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable,
         :confirmable

  validates :username, presence: true
  validates_presence_of :avatar

  def has_new_notifications?
    PublicActivity::Activity.where(recipient_id: self.id, readed: false).any?
  end

  def all_is_readed
    PublicActivity::Activity.where(recipient_id: self.id).update_all({ readed: true })
  end
end
