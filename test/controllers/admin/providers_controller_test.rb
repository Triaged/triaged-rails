require 'test_helper'

class Admin::ProvidersControllerTest < ActionController::TestCase
  setup do
    @admin_provider = admin_providers(:one)
  end

  test "should get index" do
    get :index
    assert_response :success
    assert_not_nil assigns(:admin_providers)
  end

  test "should get new" do
    get :new
    assert_response :success
  end

  test "should create admin_provider" do
    assert_difference('Admin::Provider.count') do
      post :create, admin_provider: {  }
    end

    assert_redirected_to admin_provider_path(assigns(:admin_provider))
  end

  test "should show admin_provider" do
    get :show, id: @admin_provider
    assert_response :success
  end

  test "should get edit" do
    get :edit, id: @admin_provider
    assert_response :success
  end

  test "should update admin_provider" do
    patch :update, id: @admin_provider, admin_provider: {  }
    assert_redirected_to admin_provider_path(assigns(:admin_provider))
  end

  test "should destroy admin_provider" do
    assert_difference('Admin::Provider.count', -1) do
      delete :destroy, id: @admin_provider
    end

    assert_redirected_to admin_providers_path
  end
end
