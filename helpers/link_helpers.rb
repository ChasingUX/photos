module LinkHelpers
  # This isn't as flexible as plain link_to, but the purpose is to keep it simple
  def active_link_to(title, url, options = {})
    classes = Array(options.fetch(:class, ''))
    classes << 'active' if url == current_page.url ||
                           (options.fetch(:partial_match, false) && current_page.url.include?(url))
    options[:class] = classes.join(' ')
    link_to(title, url, options)
  end
end