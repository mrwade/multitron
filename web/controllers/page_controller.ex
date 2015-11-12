defmodule Multitron.PageController do
  use Multitron.Web, :controller

  def index(conn, _params) do
    render conn, "index.html"
  end
end
