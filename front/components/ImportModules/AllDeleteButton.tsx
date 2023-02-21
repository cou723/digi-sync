import {Button, Dialog, DialogTitle, DialogContent, DialogActions, DialogContentText} from "@mui/material";
import {useState, useEffect, ChangeEvent, ReactNode} from "react";
import {useSession, signIn, signOut} from "next-auth/react";
import type {CalendarList, Event} from "../../types/gapi_calendar";
import {encodeQueryData, getEndTime, getQuarterRange, isGetEventErrorObject, GetEventsErrorObject} from "../../libs/utils";

type Props = {
    disabled: boolean;
};
let delete_event_url_list: string[];

export default function AllDeleteButton({disabled}: Props) {
    let [isShowDialog, setIsShowDialog] = useState(false);
    let [deleteEventCout, setDeleteEventCout] = useState(0);
    let [isDeleting, setIsDeleting] = useState(false);
    let [deleteCount, setDeleteCount] = useState(0);
    const {data: session} = useSession();

    const onAllDeleteClick = async () => {
        delete_event_url_list = [];
        // すべてのカレンダーを取得
        if (!(session && session.user)) return;
        let res: Response = await fetch("https://www.googleapis.com/calendar/v3/users/me/calendarList", {
            method: "GET",
            headers: {Authorization: `Bearer ${session.accessToken}`},
        });
        const all_calendar_list = (await res.json()).items;

        // すべてのカレンダーの予定を取得
        let all_events = new Map<string, Array<Event>>();
        for (const calendar of all_calendar_list) {
            let res: CalendarList | GetEventsErrorObject;
            let query_param = {
                maxResults: 2000,
                orderBy: "startTime",
                singleEvents: true,
            };
            console.log(`https://www.googleapis.com/calendar/v3/calendars/${calendar.id}/events?${encodeQueryData(query_param)}`);

            const google_api_url = `https://www.googleapis.com/calendar/v3/calendars/${calendar.id}/events?${encodeQueryData(query_param)}`;
            const raw_response = await fetch(google_api_url, {
                method: "GET",
                headers: {Authorization: `Bearer ${session.accessToken}`, "Content-Type": "application/json"},
            });
            res = await raw_response.json();
            if (isGetEventErrorObject(res)) {
                console.error(res);
                continue;
            }
            all_events.set(
                calendar.id,
                res.items.filter((event) => event.description && event.description.includes("#created_by_dp2gc"))
            );
        }
        // 取得した予定の中から詳細に#dp2gcがあるものだけを残すようフィルタリング
        const delete_events = all_events;
        let delete_count = 0;
        delete_events.forEach((v, k) => {
            delete_count += v.length;
        });
        setDeleteEventCout(delete_count);
        delete_events.forEach((v, k) => {
            for (const delete_event of v) {
                delete_event_url_list.push(`https://www.googleapis.com/calendar/v3/calendars/${k}/events/${delete_event.id}`);
            }
        });
        // フィルタリングしたものを消していいかどうかホップアップを出す
        setIsShowDialog(true);
    };

    const handleClose = () => {
        setIsShowDialog(false);
    };

    const allDelete = async () => {
        setIsDeleting(true);
        setDeleteCount(0);
        handleClose();
        let i = 0;
        if (!session) return;
        console.log();
        for (const delete_url of delete_event_url_list) {
            console.log(delete_url);
            fetch(delete_url, {
                method: "DELETE",
                headers: {Authorization: `Bearer ${session.accessToken}`, "Content-Type": "application/json"},
            });
            setDeleteCount(deleteCount =>deleteCount + 1);
            await new Promise(function (resolve) {
                setTimeout(resolve, 250);
            });
        }
        setIsDeleting(false);
    };

    return (
        <>
            <Button disabled={disabled || isDeleting} color="error" onClick={onAllDeleteClick}>
                {isDeleting ? `${deleteCount}件削除済み` : "デジシンクによって追加した予定をすべて消す"}
            </Button>
            <Dialog open={isShowDialog} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
                <DialogTitle id="alert-dialog-title">予定を削除しますか？</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">{`デジシンクによって追加された予定(${deleteEventCout}件)を削除します`}</DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} autoFocus>
                        いいえ
                    </Button>
                    <Button onClick={allDelete}>はい、削除します</Button>
                </DialogActions>
            </Dialog>
        </>
    );
}
