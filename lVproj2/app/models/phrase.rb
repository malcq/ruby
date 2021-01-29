class Phrase < ApplicationRecord
  include PublicActivity::Model
  include SharedMethods
  acts_as_votable
  # Set proper sequence
  CATEGORIES = %i(Actions Time Productivity Apologies Common)
  belongs_to :user
  has_many :examples
  accepts_nested_attributes_for :examples, allow_destroy: true
  extend FriendlyId
  friendly_id :phrase, use: :slugged

  validates :phrase, :translation, presence: true
  validates :phrase, uniqueness: true
  validates :category,
            inclusion: {
                in: %w(Actions Time Productivity Apologies Common),
                message: "%{value} is not a valid category"
            }


  enum category: CATEGORIES

end
