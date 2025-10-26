import { Await, redirect, useRouteLoaderData } from "react-router-dom";
import EventItem from "../components/EventItem";
import EventsList from "../components/EventsList";
import { Suspense } from "react";

export default function EventDetail() {
  const { event, events } = useRouteLoaderData("event-detail");

  return (
    <>
      <Suspense fallback={<p style={{ textAlign: "center" }}>Loading ...</p>}>
        <Await resolve={event}>
          {(loadedEvent) => <EventItem event={loadedEvent} />}
        </Await>
      </Suspense>
      <Suspense fallback={<p style={{ textAlign: "center" }}>Loading ...</p>}>
        <Await resolve={events}>
          {(loadedEvents) => <EventsList events={loadedEvents} />}
        </Await>
      </Suspense>
    </>
  );
}

export async function loadEvents() {
  const response = await fetch("http://localhost:8080/events");

  if (!response.ok) {
    throw new Response(JSON.stringify({ message: "Could not fetch events." }), {
      status: 500,
    });
  } else {
    const resData = await response.json();
    return resData.events;
  }
}

export async function loadEvent(id) {
  const response = await fetch(`http://localhost:8080/events/${id}`);

  if (!response.ok) {
    throw new Response(JSON.stringify({ message: "Could not fetch events." }), {
      status: 500,
    });
  } else {
    const resData = await response.json();
    return resData.event;
  }
}

export const loader = async ({ request, params }) => {
  const id = params.eventId;

  return {
    events: loadEvents(),
    event: await loadEvent(id),
  };
};

export async function action({ params, request }) {
  const eventId = params.id;

  const response = await fetch(`http://localhost:8080/events/${eventId}`, {
    method: request.method,
  });
  if (!response.ok) {
    throw new Response(JSON.stringify({ message: "Could not fetch events." }), {
      status: 500,
    });
  }

  return redirect("/events");
}
