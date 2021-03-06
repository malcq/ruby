class Example < ApplicationRecord
  include SharedMethods
  include PublicActivity::Model

  belongs_to :phrase
  belongs_to :user
  extend FriendlyId
  friendly_id :example, use: :slugged
  has_many :activities, as: :trackable, class_name: 'PublicActivity::Activity', dependent: :destroy
  acts_as_votable

  validates :example, presence: true
  validates_uniqueness_of :example, scope: :phrase_id, message: "has already been used!"
end
