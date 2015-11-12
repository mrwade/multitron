defmodule Multitron.IdServer do
  require Logger
  use GenServer

  def start_link() do
    Logger.info("Starting IdServer...")
    {:ok, _pid} = Agent.start_link(fn -> %{} end, name: __MODULE__)
  end

  def get_id(pid) do
    Agent.get(__MODULE__, &(&1[pid]))
  end

  def get_map do
    Agent.get(__MODULE__, &(&1))
  end

  def generate_id(pid) do
    Agent.update(__MODULE__, fn state ->
      Map.put(state, pid, Ecto.UUID.generate)
    end)
  end

  def delete_id(pid) do
    Agent.update(__MODULE__, fn state ->
      Map.delete(state, pid)
    end)
  end
end
