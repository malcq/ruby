module ExamplesHelper

  def show_examples_delete_link?(example)
    example.is_author?(current_user) || example.phrase.is_author?(current_user)
  end
end
