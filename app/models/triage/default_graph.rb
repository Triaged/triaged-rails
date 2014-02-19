class Triage::DefaultGraph < FeedItem

  # field :title, :type => String
  # field :body, :type => String
  # field :date, :type => Date

  #has_many :data_sets, :class_name => "Triage::DefaultGraphDataset", cascade_callbacks: true
  
  def self.default_item company

  	company_label = name.nil? ? "You" : "#{name}"

  	default_graph = Triage::DefaultGraph.new(
  		timestamp: DateTime.now,
  		date: Date.today,
  		html_url: "https://www.triaged.co/support",
  		external_id: "#{company.id}-2",
  		title: "A Daily Status example",
  	)

  	
		# Third
		third_data_set = default_graph.data_sets.build(label: "first")
		third_data_set.push(details: 	{:x => 0, 	:y => 100, :index => 0})
		third_data_set.push(details: 	{:x => 1, 	:y => 80, :index => 1})
		third_data_set.push(details: 	{:x => 2, 	:y => 30, :index => 2})
		third_data_set.push(details: 	{:x => 3, 	:y => 60, :index => 3})
		third_data_set.push(details: 	{:x => 4, 	:y => 90, :index => 4})
		third_data_set.push(details: 	{:x => 5, 	:y => 50, :index => 5})
		third_data_set.push(details: 	{:x => 6, 	:y => 20, :index => 6})
		third_data_set.total_count = 440

		# Second
		second_data_set = default_graph.data_sets.build(label: "second")
		second_data_set.push(details: 	{:x => 0, 	:y => 60, :index => 0})
		second_data_set.push(details: 	{:x => 1, 	:y => 30, :index => 1})
		second_data_set.push(details: 	{:x => 2, 	:y => 20, :index => 2})
		second_data_set.push(details: 	{:x => 3, 	:y => 70, :index => 3})
		second_data_set.push(details: 	{:x => 4, 	:y => 120, :index => 4})
		second_data_set.push(details: 	{:x => 5, 	:y => 80, :index => 5})
		second_data_set.push(details: 	{:x => 6, 	:y => 110, :index => 6})
		second_data_set.total_count = 400

		# First
  	first_data_set = default_graph.data_sets.build(label: "third")
		first_data_set.push(details: 	{:x => 0, 	:y => 20, :index => 0})
		first_data_set.push(details: 	{:x => 1, 	:y => 60, :index => 1})
		first_data_set.push(details: 	{:x => 2, 	:y => 100, :index => 2})
		first_data_set.push(details: 	{:x => 3, 	:y => 50, :index => 3})
		first_data_set.push(details: 	{:x => 4, 	:y => 30, :index => 4})
		first_data_set.push(details: 	{:x => 5, 	:y => 70, :index => 5})
		first_data_set.push(details: 	{:x => 6, 	:y => 120, :index => 6})
		first_data_set.total_count = 450

		user = User.find_by email: "team@triaged.co"
		default_graph.messages << Messages::Message.new(
  		uuid: "5",
  		timestamp: DateTime.now - 3.seconds,
  		author: user,
  		body: "Some services generate a daily status update. We'll do the number crunching before you wake up, so you can check first thing in the morning."
  	)

  	return default_graph

  end

end
