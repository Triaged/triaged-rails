class ProviderSerializer < ApplicationSerializer
  attributes :id, :name, :icon, :settings_icon, :title, :short_title, :large_icon, :small_icon

  def large_icon
    object.large_icon.url
  end

  def small_icon
    object.small_icon.url
  end
end
