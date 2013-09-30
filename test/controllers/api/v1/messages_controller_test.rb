require 'test_helper'

class Api::V1::MessagesControllerTest < ActionController::TestCase
  setup do
    @api_v1_message = api_v1_messages(:one)
  end

  test "should get index" do
    get :index
    assert_response :success
    assert_not_nil assigns(:api_v1_messages)
  end

  test "should get new" do
    get :new
    assert_response :success
  end

  test "should create api_v1_message" do
    assert_difference('Api::V1::Message.count') do
      post :create, api_v1_message: {  }
    end

    assert_redirected_to api_v1_message_path(assigns(:api_v1_message))
  end

  test "should show api_v1_message" do
    get :show, id: @api_v1_message
    assert_response :success
  end

  test "should get edit" do
    get :edit, id: @api_v1_message
    assert_response :success
  end

  test "should update api_v1_message" do
    patch :update, id: @api_v1_message, api_v1_message: {  }
    assert_redirected_to api_v1_message_path(assigns(:api_v1_message))
  end

  test "should destroy api_v1_message" do
    assert_difference('Api::V1::Message.count', -1) do
      delete :destroy, id: @api_v1_message
    end

    assert_redirected_to api_v1_messages_path
  end
end
