import React, {ReactNode, SyntheticEvent} from "react";
import ApiCalendar from "react-google-calendar-api";

export default function SigninBtns({apiCalendar}: {apiCalendar: ApiCalendar}) {
    function handleItemClick(event: SyntheticEvent<any>, name: string): void {
        if (name === "sign-in") {
            apiCalendar.handleAuthClick();
        } else if (name === "sign-out") {
            apiCalendar.handleSignoutClick();
        }
    }

    return (
        <div>
            <button onClick={(e) => handleItemClick(e, "sign-in")}>sign-in</button>
            <button onClick={(e) => handleItemClick(e, "sign-out")}>sign-out</button>
        </div>
    );
}
