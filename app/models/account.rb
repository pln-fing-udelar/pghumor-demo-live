class Account < ActiveRecord::Base
  def image_url
    if image_path.start_with?('https')
      image_path
    else
      "assets/#{image_path}"
    end
  end
end
