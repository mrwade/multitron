defmodule Multitron.GameServer do
  require Logger
  use GenServer
  alias Multitron.Game
  alias Multitron.GameSerializer

  @interval 90

  def start_link() do
    Logger.info("Starting GameServer...")
    spawn_link(fn -> schedule_tick end)
    {:ok, _pid} = Agent.start_link(fn -> %Game{} end, name: __MODULE__)
  end

  def get_game do
    Agent.get(__MODULE__, &(&1))
  end

  def add_player(player_id, player) do
    Agent.update(__MODULE__, fn game ->
      Game.add_player(game, player_id, player)
    end)
  end

  def remove_player(player_id) do
    Agent.update(__MODULE__, fn game ->
      Game.remove_player(game, player_id)
    end)
  end

  def spawn_player(player_id) do
    Agent.update(__MODULE__, fn game ->
      Game.spawn_player(game, player_id)
    end)
  end

  def update_player_direction(player_id, direction) do
    Agent.update(__MODULE__, fn game ->
      Game.update_player_direction(game, player_id, direction)
    end)
  end

  defp schedule_tick do
    :timer.sleep(@interval)

    Agent.update(__MODULE__, fn game ->
      Game.tick(game)
    end)

    game = GameSerializer.serialize(get_game)
    Multitron.Endpoint.broadcast! "game:lobby", "update", game

    schedule_tick
  end
end
