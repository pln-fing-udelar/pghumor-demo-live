class Clasificador
  include HTTParty
  base_uri 'localhost:5000'

  def evaluar tweet
    options = { :body => { :texto => tweet.text } }
    self.class.post('/evaluar', options)
  end

  def es_humor? tweet
    response = evaluar tweet
    response.parsed_response['humor'] == '1'
  end
end
