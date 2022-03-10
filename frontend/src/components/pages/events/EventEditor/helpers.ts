import dayjs from "dayjs";
import nb from "dayjs/locale/nb";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { DEFAULT_INPUT, EventDataType } from "../constants";
import { Event } from "@interfaces/events";

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.locale(nb);
dayjs.tz.setDefault("Europe/Oslo");

export const getInitialEventData = (event: Event, eventData: EventDataType): EventDataType => {
  const DATE_FORMAT = "YYYY-MM-DDTHH:mm:ss";

  const initialEventData = {
    ...eventData,
  };

  Object.keys(DEFAULT_INPUT).forEach((key) => {
    if (key in eventData && !!(event as Record<string, any>)[key]) {
      // eslint-disable-next-line
      // @ts-ignore
      initialEventData[key] = (event as Record<string, any>)[key];
    }
  });
  initialEventData.categoryId = event.category ? event.category.id : "";

  initialEventData.startTime = dayjs(event.startTime).format(DATE_FORMAT);

  initialEventData.availableSlots = event.attendable ? event.attendable.totalAvailableSlots.toString() : "";

  if (event?.attendable?.signupOpenDate) {
    initialEventData.signupOpenDate = dayjs(event?.attendable?.signupOpenDate).format(DATE_FORMAT);
  }
  if (event?.attendable?.deadline) {
    initialEventData.deadline = dayjs(event?.attendable?.deadline).format(DATE_FORMAT);
  }
  if (event.endTime) {
    initialEventData.endTime = dayjs(event.endTime).format(DATE_FORMAT);
  }

  return initialEventData;
};
