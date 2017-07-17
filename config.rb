###
# Page options, layouts, aliases and proxies
###

# Per-page layout changes:
#
# With no layout
page '/*.xml', layout: false
page '/*.json', layout: false
page '/*.txt', layout: false

config[:images_dir] = 'images'

# With alternative layout
# page "/path/to/file.html", layout: :otherlayout

# Proxy pages (http://middlemanapp.com/basics/dynamic-pages/)
# proxy "/this-page-has-no-template.html", "/template-file.html", locals: {
#  which_fake_page: "Rendering a fake page with a local variable" }

###
# Helpers
###

activate :directory_indexes
set :relative_links, true


activate :middleman_simple_thumbnailer

activate :blog do |blog|
  # This will add a prefix to all links, template references and source paths
  # blog.prefix = "blog"

  blog.permalink = "{title}"
  # Matcher for blog source files
  blog.sources = "journals/{title}"
  # blog.taglink = "tags/{tag}.html"
  blog.layout = "blog"
  # blog.summary_separator = /(READMORE)/
  # blog.summary_length = 250
  # blog.year_link = "{year}.html"
  # blog.month_link = "{year}/{month}.html"
  # blog.day_link = "{year}/{month}/{day}.html"
  #blog.default_extension = ".html"

  blog.tag_template = "tag.html"
  blog.calendar_template = "calendar.html"

  # Enable pagination
  # blog.paginate = true
  # blog.per_page = 10
  # blog.page_link = "page/{num}"
end

#set :partials_dir, 'partials/'

page "/feed.xml", layout: false
# Reload the browser automatically whenever files change
# configure :development do
#   activate :livereload
# end

# Methods defined in the helpers block are available in templates
# helpers do
#   def some_helper
#     "Helping"
#   end
# end

activate :autoprefixer

configure :build do
  # activate :autoprefixer do |config|
  #   config.browsers = ['last 20 versions']
  # end
  activate :minify_javascript
  activate :minify_css
  activate :asset_hash
  activate :relative_assets
end


# # Build-specific configuration
# configure :build do
#   # Minify CSS on build
#   # activate :minify_css

#   activate :relative_assets
#   # set :site_url, "/repo-name"
#   # Minify Javascript on build
#   # activate :minify_javascript
# end
