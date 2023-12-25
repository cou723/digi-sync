import {
	Button,
	CircularProgress,
	Dialog,
	DialogActions,
	DialogContent,
	DialogContentText,
	DialogTitle,
	LinearProgress,
	Fade,
} from "@mui/material";
import React, { useEffect, useState } from "react";

import { useCustomSession } from "@/hooks/useCustomSession";
import { GoogleCalendar, CalendarId } from "@/libs/googleCalendar";

import type { Event } from "../../types/gapiCalendar";

let deleteEventUrlList: string[];

type Props = {
	disabled: boolean;
};

export default React.memo(function AllDeleteButton({ disabled }: Props) {
	const [isShowDialog, setIsShowDialog] = useState(false);
	const [deleteEventCout, setDeleteEventCout] = useState(0);
	const [deleteStatus, setDeleteStatus] = useState<
		"unauthenticated" | "ready" | "getting_calendar" | "deleting"
	>("unauthenticated");
	const [deleteCount, setDeleteCount] = useState(0);
	const { session, authStatus } = useCustomSession();

	useEffect(() => {
		if (authStatus == "unauthenticated") setDeleteStatus("unauthenticated");
		else setDeleteStatus("ready");
	}, [authStatus]);

	const onAllDeleteClick = async () => {
		setDeleteStatus("getting_calendar");
		deleteEventUrlList = [];

		if (!(session && session.user)) return;
		const deleteEvents: Map<CalendarId, Event[]> =
			await GoogleCalendar.getAllDigisyncEvents(session);
		let deleteCount = 0;
		deleteEvents.forEach((events) => {
			deleteCount += events.length;
		});
		setDeleteEventCout(deleteCount);
		deleteEvents.forEach((events, calendarId) => {
			for (const deleteEvent of events) {
				deleteEventUrlList.push(
					`https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events/${deleteEvent.id}`,
				);
			}
		});

		// フィルタリングしたものを消していいかどうかホップアップを出す
		setIsShowDialog(true);
	};

	const handleClose = () => {
		setIsShowDialog(false);
		setDeleteStatus("ready");
	};

	const allDelete = async () => {
		setIsShowDialog(false);
		setDeleteStatus("deleting");
		setDeleteCount(0);
		if (!session) return;
		await GoogleCalendar.deleteEvents(deleteEventUrlList, session, setDeleteCount);
		setDeleteStatus("ready");
	};

	return (
		<>
			<Button
				color='error'
				disabled={deleteStatus != "ready" || disabled}
				onClick={onAllDeleteClick}
				style={{ textTransform: "none" }}
			>
				{
					{
						deleting: `${deleteCount}件削除済み`,
						getting_calendar:
							"カレンダーからデジシンクによって追加された予定を検索中\n(30秒ほどかかります)",
						ready: "デジシンクによって追加した予定をすべて消す",
						unauthenticated: "Googleアカウントにログインしてください",
					}[deleteStatus]
				}
				<Fade in={deleteStatus == "getting_calendar"}>
					<CircularProgress />
				</Fade>
			</Button>
			<LinearProgress
				style={{ display: deleteStatus == "deleting" ? "inline" : "none" }}
				value={(deleteCount / deleteEventCout) * 100}
				variant='determinate'
			/>
			<Dialog
				aria-describedby='alert-dialog-description'
				aria-labelledby='alert-dialog-title'
				open={isShowDialog}
			>
				<DialogTitle id='alert-dialog-title'>予定を削除しますか？</DialogTitle>
				<DialogContent>
					<DialogContentText id='alert-dialog-description'>
						デジシンクによって追加された予定({deleteEventCout}件)を削除します
					</DialogContentText>
				</DialogContent>
				<DialogActions>
					<Button autoFocus onClick={handleClose}>
						いいえ
					</Button>
					<Button onClick={allDelete}>はい。削除します。</Button>
				</DialogActions>
			</Dialog>
		</>
	);
});
