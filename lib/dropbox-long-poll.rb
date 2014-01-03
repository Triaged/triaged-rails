require 'dropbox_sdk'
require 'rest-client'

access_token = "BCB3a69ENPAAAAAAAAAAAZVh2e4hiE-U9f2LvKkQ1RL-ESOJ9Regxc0m3mFF-CUR"
client = DropboxClient.new(access_token)
cursor = nil

while true
  result = client.delta(cursor)
  puts result
  cursor = result['cursor']

  
  puts 'RESET' if result['reset']
      

  for path, metadata in result['entries']
      if metadata != nil
          puts '%s was created/updated' % path
      else
          puts '%s was deleted' % path
      end
  end

  # if has_more is true, call delta again immediately
  if not result['has_more']

      changes = false
      # poll until there are changes
      while not changes
          response =  RestClient.get('https://api-notify.dropbox.com/1/longpoll_delta',
              { :params => { 'cursor' => cursor,  # latest cursor from delta call
                  'timeout' => 120     # default is 30 seconds
              }})
          data = JSON.parse(response)

          changes = data['changes']
          if not changes
              puts 'Timeout, polling again...'
          end

          backoff = data['backoff']
          if backoff != nil && backoff != false
              puts "Backoff requested. Sleeping for #{backoff} seconds..."
              time.sleep(backoff)
              puts 'Resuming polling...'
          end
      end
  end
end