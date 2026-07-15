import client from "./client";

export async function fetchTickets() {
  const { data } = await client.get("/tickets");
  return data.tickets;
}

export async function createTicket(payload) {
  const { data } = await client.post("/tickets", payload);
  return data.ticket;
}

export async function updateTicketStatus(id, status) {
  const { data } = await client.put(`/tickets/${id}`, { status });
  return data.ticket;
}