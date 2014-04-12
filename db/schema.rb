# encoding: UTF-8
# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 20140412203448) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "admins", force: true do |t|
    t.string   "email",                  default: "", null: false
    t.string   "encrypted_password",     default: "", null: false
    t.string   "reset_password_token"
    t.datetime "reset_password_sent_at"
    t.datetime "remember_created_at"
    t.integer  "sign_in_count",          default: 0,  null: false
    t.datetime "current_sign_in_at"
    t.datetime "last_sign_in_at"
    t.string   "current_sign_in_ip"
    t.string   "last_sign_in_ip"
  end

  add_index "admins", ["email"], name: "index_admins_on_email", unique: true, using: :btree
  add_index "admins", ["reset_password_token"], name: "index_admins_on_reset_password_token", unique: true, using: :btree

  create_table "companies", force: true do |t|
    t.string "name"
    t.string "api_token"
    t.string "slug"
  end

  create_table "connected_providers", force: true do |t|
    t.integer "company_id"
    t.integer "provider_id"
  end

  create_table "cursors", force: true do |t|
    t.text    "current"
    t.integer "company_id"
    t.integer "provider_id"
  end

  create_table "event_types", force: true do |t|
    t.string   "name"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.integer  "provider_id"
  end

  add_index "event_types", ["provider_id"], name: "index_event_types_on_provider_id", using: :btree

  create_table "feed_items", force: true do |t|
    t.integer  "as_feed_item_id"
    t.string   "as_feed_item_type"
    t.integer  "company_id"
    t.integer  "author_id"
    t.boolean  "push_notify"
    t.datetime "timestamp"
    t.integer  "provider_id"
    t.integer  "provider_account_id"
    t.string   "provider_name"
    t.string   "event_name"
    t.string   "account_name"
    t.string   "property_name"
    t.string   "external_id"
    t.text     "title"
    t.text     "body"
    t.string   "body_list",           default: [],    array: true
    t.text     "footer"
    t.string   "url"
    t.string   "thumbnail_url"
    t.string   "image_url"
    t.string   "icon"
    t.string   "mime_type"
    t.boolean  "group_event",         default: false
    t.string   "event_image"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.integer  "messages_count",      default: 0
    t.integer  "event_type_id"
  end

  add_index "feed_items", ["event_type_id"], name: "index_feed_items_on_event_type_id", using: :btree

  create_table "friendly_id_slugs", force: true do |t|
    t.string   "slug",                      null: false
    t.integer  "sluggable_id",              null: false
    t.string   "sluggable_type", limit: 50
    t.string   "scope"
    t.datetime "created_at"
  end

  add_index "friendly_id_slugs", ["slug", "sluggable_type", "scope"], name: "index_friendly_id_slugs_on_slug_and_sluggable_type_and_scope", unique: true, using: :btree
  add_index "friendly_id_slugs", ["slug", "sluggable_type"], name: "index_friendly_id_slugs_on_slug_and_sluggable_type", using: :btree
  add_index "friendly_id_slugs", ["sluggable_id"], name: "index_friendly_id_slugs_on_sluggable_id", using: :btree
  add_index "friendly_id_slugs", ["sluggable_type"], name: "index_friendly_id_slugs_on_sluggable_type", using: :btree

  create_table "ignores", force: true do |t|
    t.integer "ignorer_id"
    t.string  "ignorer_type"
  end

  create_table "messages", force: true do |t|
    t.integer  "feed_item_id"
    t.integer  "author_id"
    t.string   "uuid"
    t.string   "author_name"
    t.datetime "timestamp"
    t.string   "body"
    t.string   "user_mentions", default: [], array: true
    t.string   "type"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "notifications", force: true do |t|
    t.integer "user_id"
    t.string  "body"
    t.boolean "viewed",  default: false
  end

  create_table "provider_accounts", force: true do |t|
    t.integer "provider_id"
    t.integer "company_id"
    t.string  "external_id"
    t.string  "name"
    t.string  "url"
    t.boolean "default",     default: false
    t.boolean "personal",    default: false
  end

  create_table "provider_credentials", force: true do |t|
    t.integer "user_id"
    t.integer "provider_id"
    t.integer "company_id"
    t.string  "uid"
    t.string  "access_token"
    t.string  "token_secret"
    t.string  "refresh_token"
  end

  create_table "provider_properties", force: true do |t|
    t.integer "provider_account_id"
    t.string  "external_id"
    t.string  "name"
  end

  create_table "providers", force: true do |t|
    t.string  "name"
    t.string  "title"
    t.string  "short_title"
    t.boolean "active"
    t.boolean "oauth",            default: false
    t.boolean "zapier",           default: false
    t.boolean "webhooks_enabled", default: false
    t.string  "account_label"
    t.string  "property_label"
    t.string  "large_icon"
    t.string  "small_icon"
  end

  create_table "push_tokens", force: true do |t|
    t.integer "user_id"
    t.string  "service"
    t.string  "token"
    t.string  "count"
  end

  create_table "shares", force: true do |t|
    t.integer "feed_item_id"
    t.integer "user_id"
    t.string  "recipient_email"
    t.boolean "viewed"
  end

  create_table "thumbsups", force: true do |t|
    t.integer  "feed_item_id"
    t.integer  "user_id"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "trigrams", force: true do |t|
  end

  create_table "user_feed_items", force: true do |t|
    t.integer  "user_id"
    t.integer  "feed_item_id"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "users", force: true do |t|
    t.string   "first_name"
    t.string   "last_name"
    t.boolean  "push_enabled"
    t.boolean  "validated_belongs_to_company"
    t.string   "company_validation_token"
    t.boolean  "personal"
    t.string   "email",                        default: "",    null: false
    t.string   "encrypted_password",           default: "",    null: false
    t.string   "reset_password_token"
    t.datetime "reset_password_sent_at"
    t.datetime "remember_created_at"
    t.integer  "sign_in_count",                default: 0,     null: false
    t.datetime "current_sign_in_at"
    t.datetime "last_sign_in_at"
    t.string   "current_sign_in_ip"
    t.string   "last_sign_in_ip"
    t.string   "authentication_token"
    t.boolean  "registered",                   default: false
    t.integer  "company_id"
    t.string   "avatar"
    t.string   "slug"
  end

  add_index "users", ["company_id"], name: "index_users_on_company_id", using: :btree
  add_index "users", ["email"], name: "index_users_on_email", unique: true, using: :btree
  add_index "users", ["reset_password_token"], name: "index_users_on_reset_password_token", unique: true, using: :btree

end
