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
import { useTranslation } from "next-i18next";
import React, { useEffect, useState } from "react";

import { useCustomSession } from "@/hooks/useCustomSession";
import { GoogleCalendar, CalendarId } from "@/libs/googleCalendar";

import type { Event } from "../../types/gapiCalendar";

let deleteEventUrlList: string[];

type Props = {
	disabled: boolean;
};

export default React.memo(function AllDeleteButton({ disabled }: Props) {
	const { t } = useTranslation("components");
	const { t: cc } = useTranslation("common");
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
		const deleteEvents: Map<CalendarId, Event[]> = await GoogleCalendar.getAllDigisyncEvents(
			session,
		);
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
						deleting: `${deleteCount}${cc("unit")}${t(
							"importModules.AllDeleteButton.deleted",
						)}`,
						getting_calendar: t("importModules.AllDeleteButton.searching"),
						ready: t("importModules.AllDeleteButton.label"),
						unauthenticated: t("importModules.AllDeleteButton.unauthenticated"),
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
				<DialogTitle id='alert-dialog-title'>
					{t("importModules.AllDeleteButton.title")}
				</DialogTitle>
				<DialogContent>
					<DialogContentText id='alert-dialog-description'>
						{`${t(
							"importModules.AllDeleteButton.events_added_by_digisync",
						)}(${deleteEventCout} ${cc("unit")})${t(
							"importModules.AllDeleteButton.delete",
						)}`}
					</DialogContentText>
				</DialogContent>
				<DialogActions>
					<Button autoFocus onClick={handleClose}>
						{cc("no")}
					</Button>
					<Button onClick={allDelete}>
						{t("importModules.AllDeleteButton.yes_delete")}
					</Button>
				</DialogActions>
			</Dialog>
		</>
	);
});
