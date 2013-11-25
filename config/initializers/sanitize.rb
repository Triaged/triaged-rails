class String
  def sanitize
    self.gsub(/(<br\s*\/?>)+/, ' ')
  end
end