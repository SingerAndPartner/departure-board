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
  Discourse.top_menu_items.push(:departure_board)
  Discourse.filters.push(:departure_board)

  require_dependency 'list_controller'
  class ::ListController
    def departure_board
      unless SiteSetting.departure_board_enabled
        render nothing: true, status: 404
      end
      list_opts = build_topic_list_options
      target_user = fetch_user_from_params(include_inactive: current_user.try(:staff?))
      list = generate_list_for("departure_board", target_user, list_opts)
      list.more_topics_url = url_for(construct_url_with(:next, list_opts))
      list.prev_topics_url = url_for(construct_url_with(:prev, list_opts))
      respond_with_list(list)
    end
  end

  require_dependency 'topic_query'
  class ::TopicQuery
    def list_departure_board
      create_list(:latest, {}, latest_results)
    end
  end
end