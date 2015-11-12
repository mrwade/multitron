defmodule Multitron.GameSerializer do
  alias Multitron.Game

  def serialize(%Game{} = game) do
    %{players: serialize_players(game)}
  end

  defp serialize_players(%Game{} = game) do
    Enum.map(Map.keys(game.players), fn player_id ->
      {player_id, serialize_player(game, player_id)}
    end)
    |> Enum.into(%{})
  end

  defp serialize_player(%Game{} = game, player_id) do
    {name, color, x, y, direction} = game.players[player_id]

    %{name: name,
      color: color,
      vector: [x, y, direction],
      positions: Enum.map(game.positions[player_id], fn {x, y} -> [x, y] end)}
  end
end
