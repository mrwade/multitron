defmodule Multitron.Game do
  defstruct board_size: {140, 100}, players: %{}, positions: %{}

  @doc ~S"""
  ## Examples

      iex> Multitron.Game.add_player(%Multitron.Game{}, "p1",
      ...>   {0, "kevin", 10, 10, :up})
      %Multitron.Game{players: %{"p1" => {0, "kevin", 10, 10, :up}}}

  """
  def add_player(game, player_id, {_name, _color, _x, _y, _direction} = player) do
    %{game | players: Map.put(game.players, player_id, player)}
  end

  def remove_player(game, player_id) do
    %{game |
      players: Map.delete(game.players, player_id),
      positions: Map.delete(game.positions, player_id)}
  end

  def spawn_player(game, player_id) do
    {width, height} = game.board_size
    {name, color, _, _, direction} = game.players[player_id]
    player = {name, color, round(width/2), round(height/2), direction}

    players = Map.put(game.players, player_id, player)
    %{game |
      players: players,
      positions: Map.put(game.positions, player_id, [])}
  end

  def update_player_direction(game, player_id, direction) do
    {name, color, x, y, _} = game.players[player_id]
    players = Map.put(game.players, player_id, {name, color, x, y, direction})
    %{game | players: players}
  end

  @doc ~S"""
  ## Examples

      iex> Multitron.Game.tick(
      ...>   %Multitron.Game{players: %{
      ...>     "p1" => {0, "kevin", 10, 10, :up},
      ...>     "p2" => {0, "eric", 5, 5, :right}}})
      %Multitron.Game{
        players: %{
          "p1" => {0, "kevin", 10, 9, :up},
          "p2" => {0, "eric", 6, 5, :right}},
        positions: %{
          "p1" => [{10, 9}],
          "p2" => [{6, 5}]}}

      iex> Multitron.Game.tick(
      ...>   %Multitron.Game{
      ...>     players: %{
      ...>       "p1" => {0, "kevin", 7, 6, :down},
      ...>       "p2" => {0, "eric", 6, 5, :right}},
      ...>     positions: %{
      ...>       "p1" => [{7, 6}, {7, 5}, {7, 4}],
      ...>       "p2" => [{6, 5}]}})
      %Multitron.Game{
        players: %{
          "p1" => {0, "kevin", 7, 7, :down},
          "p2" => {0, "eric", 6, 5, :right}},
        positions: %{
          "p1" => [{7, 7}, {7, 6}, {7, 5}, {7, 4}]}}

  """
  def tick(game) do
    positions = next_positions(game)
    events = calc_events(game, positions)
    apply_events(game, events, positions)
  end

  def next_positions(game) do
    Map.keys(game.positions)
    |> Enum.map(fn player_id ->
      player = game.players[player_id]
      {player_id, next_position(player)}
    end)
    |> Enum.into(%{})
  end

  @doc ~S"""
  ## Examples

      iex> Multitron.Game.next_position({0, "p1", 10, 10, :up})
      {10, 9}

      iex> Multitron.Game.next_position({0, "p1", 10, 10, :right})
      {11, 10}

      iex> Multitron.Game.next_position({0, "p1", 10, 10, :down})
      {10, 11}

      iex> Multitron.Game.next_position({0, "p1", 10, 10, :left})
      {9, 10}

  """
  def next_position({_, _, x, y, direction}) do
    case direction do
      :up -> {x, y - 1}
      :right -> {x + 1, y}
      :down -> {x, y + 1}
      :left -> {x - 1, y}
    end
  end

  def calc_events(game, player_positions) do
    Enum.map(Map.keys(player_positions), fn player_id ->
      position = player_positions[player_id]
      if !inside_board?(game, position) || position_occupied?(game, position) do
        # || will be occupied
        {:died, player_id}
      else
        {:moved, player_id}
      end
    end)
  end

  def apply_events(game, events, positions) do
    Enum.reduce(events, game, fn event, game ->
      case event do
        {:died, player_id} -> kill_player(game, player_id)
        {:moved, player_id} -> move_player(game, player_id, positions[player_id])
      end
    end)
  end

  @doc ~S"""
  ## Examples

      iex> Multitron.Game.kill_player(
      ...>   %Multitron.Game{positions: %{"p1" => []}},
      ...>   "p1")
      %Multitron.Game{positions: %{}}

  """
  def kill_player(game, player_id) do
    %{game | positions: Map.delete(game.positions, player_id) }
  end

  @doc ~S"""
  ## Examples

      iex> Multitron.Game.move_player(
      ...>   %Multitron.Game{
      ...>     players: %{"p1" => {"kevin", "#00f", 4, 5, :left}},
      ...>     positions: %{"p1" => [{4, 5}]}},
      ...>   "p1", {5, 5})
      %Multitron.Game{
        players: %{"p1" => {"kevin", "#00f", 5, 5, :left}},
        positions: %{"p1" => [{5, 5}, {4, 5}]}}

  """
  def move_player(game, player_id, {x, y} = position) do
    positions = update_in game.positions, [player_id], &([position | (&1 || [])])
    {name, color, _, _, direction} = game.players[player_id]
    %{game |
      players: Map.put(game.players, player_id, {name, color, x, y, direction}),
      positions: positions}
  end

  @doc ~S"""
  ## Examples

      iex> Multitron.Game.inside_board?(
      ...>   %Multitron.Game{board_size: {200, 200}},
      ...>   {100, 100})
      true

      iex> Multitron.Game.inside_board?(
      ...>   %Multitron.Game{board_size: {200, 200}},
      ...>   {250, 100})
      false

      iex> Multitron.Game.inside_board?(
      ...>   %Multitron.Game{board_size: {200, 200}},
      ...>   {100, -100})
      false

  """
  def inside_board?(game, {x, y}) do
    {width, height} = game.board_size
    x >= 0 && x <= width - 1 && y >= 0 && y <= height - 1
  end

  @doc ~S"""
  ## Examples

      iex> Multitron.Game.position_occupied?(
      ...>   %Multitron.Game{positions: %{"p1" => [{5, 5}]}},
      ...>   {5, 5})
      true

      iex> Multitron.Game.position_occupied?(
      ...>   %Multitron.Game{positions: %{"p1" => [{5, 5}]}},
      ...>   {4, 4})
      false

  """
  def position_occupied?(game, position) do
    Enum.any?(Map.values(game.positions), fn positions ->
      Enum.any?(positions, &(&1 == position))
    end)
  end
end
