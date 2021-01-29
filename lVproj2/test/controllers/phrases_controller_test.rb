require 'test_helper'

class PhrasesControllerTest < ActionDispatch::IntegrationTest
  test "should get new" do
    get phrases_new_url
    assert_response :success
  end

  test "should get create" do
    get phrases_create_url
    assert_response :success
  end

  test "should get index" do
    get phrases_index_url
    assert_response :success
  end

end
