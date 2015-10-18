module TweetsHelper
  @@clasificador = Clasificador.new

  def es_humor? tweet
    evaluacion = @@clasificador.evaluar tweet
    evaluacion.parsed_response['humor'] == '1'
  end
end
