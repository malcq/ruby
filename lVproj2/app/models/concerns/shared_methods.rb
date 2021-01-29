module SharedMethods
  extend ActiveSupport::Concern

  def is_author?(user)
    self.user == user
  end

  def add_carma(vote, current_user)
    current_user_carma = current_user.carma
    author_carma = self.user.carma
    author = self.user

    if self.class.name == 'Example'
      author_point = vote == 'up' ? 2 : -1
    else
      author_point = vote == 'up' ? 4 : -2
    end

    author.update_attribute('carma', author_carma + author_point)
    current_user.update_attribute('carma', current_user_carma + 1)
  end
end