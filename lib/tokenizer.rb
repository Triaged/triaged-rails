module Tokenizer

  #autoload :ActiveRecordExtension, "shortener/active_record_extension"
  #autoload :ShortenUrlInterceptor, "shortener/shorten_url_interceptor"

  CHARSETS = {
    :alphanum => ('a'..'z').to_a + (0..9).to_a,
    :alphanumcase => ('A'..'Z').to_a + (0..9).to_a }

  # default key length: 5 characters
  mattr_accessor :unique_key_length
  self.unique_key_length = 5

  # character set to chose from:
  #  :alphanum     - a-z0-9     -  has about 60 million possible combos
  #  :alphanumcase - a-zA-Z0-9  -  has about 900 million possible combos
  mattr_accessor :charset
  self.charset = :alphanumcase

  def self.key_chars
    CHARSETS[charset]
  end

  def self.unique_token(char_count = self.unique_key_length)
  	charset = self.key_chars
    (0...char_count).map{ charset[rand(charset.size)] }.join
  end
  
end
