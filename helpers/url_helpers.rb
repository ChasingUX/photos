module UrlHelpers
  def current_page_url
    full_url_for(current_page.url)
  end

  def full_url_for(path)
    if path.start_with?('/')
      "https://stories.jessecha.se/#{path}"
    else
      "https://stories.jessecha.se/#{path}"
    end
  end
end
