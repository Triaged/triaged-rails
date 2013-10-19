# app/validators/email_validator.rb
class EmailValidator < ActiveModel::EachValidator
  def validate_each(record,attribute,value)
    begin
     r = true
     m = Mail::Address.new(value)
     text=File.open("#{Rails.root}/emails.txt").read
     text.each_line do |line|
  		r = false if (m.domain == line.strip)
		 end
    rescue Exception => e   
      r = false
    end
    record.errors[attribute] << (options[:message] || "must be your work address") unless r
  end
end