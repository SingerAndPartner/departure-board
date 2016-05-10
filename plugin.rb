# name: departure-board
# about: Adds the flapper library to the latest feed
# version: 0.1
# author: Joe Buhlig joebuhlig.com
# url: https://github.com/SingerAndPartner/departure-board

register_asset "stylesheets/flapper.css"
register_asset "javascripts/jquery.transform-0.9.3.js"
register_asset "javascripts/jquery.flapper.js"
register_asset "javascripts/departure-board.js"

enabled_site_setting :departure_board_enabled

after_initialize do
  Discourse.top_menu_items.push(:departure)
  Discourse.filters.push(:departure)

  require_dependency 'list_controller'
  class ::ListController
    def departure
      user = list_target_user
      list_opts = build_topic_list_options
      list_opts[:per_page] = 10
      list = TopicQuery.new(user, list_opts).public_send("list_latest")
      respond_with_list(list)
    end
  end

  Discourse::Application.routes.append do
    get "departure" => "list#departure"
  end
end