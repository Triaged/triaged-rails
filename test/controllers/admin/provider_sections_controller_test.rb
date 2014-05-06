require 'test_helper'

class Admin::ProviderSectionsControllerTest < ActionController::TestCase
  setup do
    @admin_provider_section = admin_provider_sections(:one)
  end

  test "should get index" do
    get :index
    assert_response :success
    assert_not_nil assigns(:admin_provider_sections)
  end

  test "should get new" do
    get :new
    assert_response :success
  end

  test "should create admin_provider_section" do
    assert_difference('Admin::ProviderSection.count') do
      post :create, admin_provider_section: {  }
    end

    assert_redirected_to admin_provider_section_path(assigns(:admin_provider_section))
  end

  test "should show admin_provider_section" do
    get :show, id: @admin_provider_section
    assert_response :success
  end

  test "should get edit" do
    get :edit, id: @admin_provider_section
    assert_response :success
  end

  test "should update admin_provider_section" do
    patch :update, id: @admin_provider_section, admin_provider_section: {  }
    assert_redirected_to admin_provider_section_path(assigns(:admin_provider_section))
  end

  test "should destroy admin_provider_section" do
    assert_difference('Admin::ProviderSection.count', -1) do
      delete :destroy, id: @admin_provider_section
    end

    assert_redirected_to admin_provider_sections_path
  end
end
