require 'test_helper'

class StatusEntriesControllerTest < ActionController::TestCase
  setup do
    @status_entry = status_entries(:one)
  end

  test "should get index" do
    get :index
    assert_response :success
    assert_not_nil assigns(:status_entries)
  end

  test "should get new" do
    get :new
    assert_response :success
  end

  test "should create status_entry" do
    assert_difference('StatusEntry.count') do
      post :create, status_entry: {  }
    end

    assert_redirected_to status_entry_path(assigns(:status_entry))
  end

  test "should show status_entry" do
    get :show, id: @status_entry
    assert_response :success
  end

  test "should get edit" do
    get :edit, id: @status_entry
    assert_response :success
  end

  test "should update status_entry" do
    patch :update, id: @status_entry, status_entry: {  }
    assert_redirected_to status_entry_path(assigns(:status_entry))
  end

  test "should destroy status_entry" do
    assert_difference('StatusEntry.count', -1) do
      delete :destroy, id: @status_entry
    end

    assert_redirected_to status_entries_path
  end
end
