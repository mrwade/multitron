defmodule Multitron.GameChannel do
  use Multitron.Web, :channel
  alias Multitron.GameServer
  alias Multitron.IdServer

  def join("game:lobby", payload, socket) do
    if authorized?(payload) do
      IdServer.generate_id(socket.transport_pid)
      {:ok, socket}
    else
      {:error, %{reason: "unauthorized"}}
    end
  end

  def terminate(_reason, socket) do
    IdServer.get_id(socket.transport_pid)
    |> GameServer.remove_player
  end

  def handle_in("join", %{"name" => name}, socket) do
    player_id = IdServer.get_id(socket.transport_pid)
    GameServer.add_player(player_id, {name, "#f00", 100, 100, :right})
    {:reply, {:ok, %{"player_id" => player_id}}, socket}
  end

  def handle_in("direction", direction_string, socket) do
    direction = String.to_existing_atom(direction_string)
    IdServer.get_id(socket.transport_pid)
    |> GameServer.update_player_direction(direction)
    {:noreply, socket}
  end

  def handle_in("spawn", _, socket) do
    IdServer.get_id(socket.transport_pid)
    |> GameServer.spawn_player
    {:noreply, socket}
  end

  # It is also common to receive messages from the client and
  # broadcast to everyone in the current topic (game:lobby).
  def handle_in("shout", payload, socket) do
    broadcast socket, "shout", payload
    {:noreply, socket}
  end

  # This is invoked every time a notification is being broadcast
  # to the client. The default implementation is just to push it
  # downstream but one could filter or change the event.
  def handle_out(event, payload, socket) do
    push socket, event, payload
    {:noreply, socket}
  end

  # Add authorization logic here as required.
  defp authorized?(_payload) do
    true
  end
end
