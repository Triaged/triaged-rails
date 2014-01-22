# total users
User.count

# validated users
@unvalidated_users = User.where(validated_belongs_to_company: false).count

# User signed in less than 2 days ago
dau = User.where(:last_sign_in_at.gte => 2.days.ago).count

# MAU
mau = User.where(:last_sign_in_at.gte => 30.days.ago).count

# users with a connected service
connected_companies_count = Company.all.select {|company| company.connected_providers.count > 0 }.count
# 492
users = companies.collect {|company| company.users}

#total companies
all_companies_count = Company.count

# total connected providers
count = 0
Company.all.each {|company| count += company.connected_providers.count }
# 885


# companies with multiple users
Company.all.select {|company| company.users.count > 0 }.count

#companies with 
