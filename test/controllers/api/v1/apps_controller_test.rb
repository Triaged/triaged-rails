require 'test_helper'

class Api::V1::AppsControllerTest < ActionController::TestCase
  setup do
    @api_v1_app = api_v1_apps(:one)
  end

  test "should get index" do
    get :index
    assert_response :success
    assert_not_nil assigns(:api_v1_apps)
  end

  test "should get new" do
    get :new
    assert_response :success
  end

  test "should create api_v1_app" do
    assert_difference('Api::V1::App.count') do
      post :create, api_v1_app: {  }
    end

    assert_redirected_to api_v1_app_path(assigns(:api_v1_app))
  end

  test "should show api_v1_app" do
    get :show, id: @api_v1_app
    assert_response :success
  end

  test "should get edit" do
    get :edit, id: @api_v1_app
    assert_response :success
  end

  test "should update api_v1_app" do
    patch :update, id: @api_v1_app, api_v1_app: {  }
    assert_redirected_to api_v1_app_path(assigns(:api_v1_app))
  end

  test "should destroy api_v1_app" do
    assert_difference('Api::V1::App.count', -1) do
      delete :destroy, id: @api_v1_app
    end

    assert_redirected_to api_v1_apps_path
  end
end
