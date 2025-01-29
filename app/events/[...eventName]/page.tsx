import Image from "next/image";
import { Clock, MapPin } from "lucide-react";
import CalendarEvent from "@/lib/interfaces/calendar-event";
import { getImageData, sanityClient } from "@/lib/utils/sanity";
import { PortableText } from "@portabletext/react";
import { generateIsc } from "@/lib/utils/generateIsc";
import { getGoogleMapsLink } from "@/lib/utils/get-google-maps-link";
import { Card } from "@/shadcn-ui/components/ui/card";
import { dateWithNnLocale } from "@/lib/utils/date";
import Map from "@/components/Map";
import Breadcrumbs from "@/components/event-page/breadcrumbs";

interface OwnProps {
  params: { eventName: string };
}

async function getData(eventName: string) {
  const query = `
    *[_type == "calendar" && slug.current == "${eventName}"]{
      title,
      date,
      description,
      "image": event_image,
      duration,
      "slug": slug.current,
      location
    }[0]
  `;

  const event = await sanityClient.fetch<CalendarEvent>(query);

  if (event) generateIsc(event);

  return event;
}

export async function generateStaticParams() {
  const query = `
  *[_type == "calendar"]{
    "slug": slug.current,
  }
`;

  return (await sanityClient.fetch<CalendarEvent[]>(query)).map(({ slug }) => ({
    eventName: [slug],
  }));
}

export default async function Event({ params: { eventName } }: OwnProps) {
  const event = await getData(eventName[0]);

  if (!event) {
    return <div>Event not found</div>;
  }

  return (
    <>
      <div className="relative h-[500px] w-full bg-gradient-to-br from-blue-500 via-purple-500 to-red-500">
        {event.image && (
          <Image
            priority
            src={getImageData(event.image).url()}
            alt="banner"
            objectFit="cover"
            width={1920}
            height={500}
            className="h-full w-full object-cover"
          />
        )}
      </div>
      <div className="container mx-auto pt-10 px-4 pb-40">
        <Breadcrumbs pageName={event.title} />
        <div className="flex items-start flex-col sm:flex-row justify-between pb-40">
          <div>
            <h1 className="font-bold text-3xl text-center mb-4 mt-12">
              {event.title}
            </h1>
            <div className="prose w-full max-w-full dark:prose-invert prose-li:marker:text-primary prose-a:text-primary">
              <PortableText value={event.description} />
            </div>
          </div>
          <Card className="flex md:flex-col justify-around p-4 md:ml-12 md:w-96 w-full">
            <div>
              <div className="flex items-center">
                <MapPin className="h-3.5 w-3.5 mr-1" />
                <p className=" font-bold text-lg">Kvar</p>
              </div>
              <p>{event.location}</p>
              <a
                href={getGoogleMapsLink(event.location)}
                target="_blank"
                className="text-primary underline hover:no-underline"
              >
                Få vegen
              </a>
            </div>
            <div className="md:mt-4">
              <div className="flex items-center">
                <Clock className="h-3.5 w-3.5 mr-1" />
                <p className=" font-bold text-lg">Når</p>
              </div>
              <p>
                {dateWithNnLocale(event.date, "iiii, MMMM dd")},{" "}
                {event.duration}
              </p>
              <a
                href={`/calendar/${eventName[0]}.ics`}
                download
                className="text-primary underline hover:no-underline"
              >
                Legg til i kalenderen
              </a>
            </div>
          </Card>
        </div>
        <Map location={event.location} />
      </div>
    </>
  );
}
