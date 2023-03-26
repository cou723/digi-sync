import { Dispatch, SetStateAction, useEffect, useState } from "react";

import { ICalEvent, ICalEventData } from "ical-generator";
import { DownloadBrowser } from "../libs/table-to-ical/DownloadBrowser";

export type useClassTableIcalProps = {
    init: Array<ICalEvent | ICalEventData>;
};
export type useClassTableIcalTypes = {
    DownloadFile: (
        event: useClassTableIcalProps["init"]
    ) => Promise<string | null>;
    setCalenderEvents: Dispatch<SetStateAction<(ICalEvent | ICalEventData)[]>>;
    CalenderEvents: useClassTableIcalProps["init"];
    AddEvent: (event: useClassTableIcalProps["init"]) => void;
};

export const useClassTableIcal = (
    props?: useClassTableIcalProps
): useClassTableIcalTypes => {
    const [CalenderEvents, setCalenderEvents] = useState<
        useClassTableIcalProps["init"]
    >(props?.init || []);

    const AddEvent = (event: useClassTableIcalProps["init"]) => {
        setCalenderEvents((pre) => {
            return event.concat(pre);
        });
    };

    // ファイルをダウンロード
    const DownloadFile = async (
        event: useClassTableIcalProps["init"]
    ): Promise<string> => {
        try {
            return DownloadBrowser(event);
        } catch (error) {
            console.error(" can not download", error);
            return "/";
        }
    };

    return {
        setCalenderEvents,
        CalenderEvents,
        DownloadFile,
        AddEvent,
    };
};
