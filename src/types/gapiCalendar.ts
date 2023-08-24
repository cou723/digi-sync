// Type definitions for Google Calendar API 3.0
// Project: https://developers.google.com/google-apps/calendar/
// Definitions by: Tanguy Krotoff <https://github.com/tkrotoff>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped
// TypeScript Version: 2.3

// The type of the scope. Possible values are:
type ScopeType =
	// The public scope. This is the default value.
	// Note: The permissions granted to the "default", or public, scope apply to any user, authenticated or not.
	| "default"
	// Limits the scope to a single user.
	| "user"
	// Limits the scope to a group.
	| "group"
	// Limits the scope to a domain.
	| "domain";

type AccessRoleWithoutNone =
	// The user has read access to free/busy information.
	| "freeBusyReader"
	// The user has read access to the calendar. Private events will appear to users with reader access, but event details will be hidden.
	| "reader"
	// The user has read and write access to the calendar. Private events will appear to users with writer access, and event details will be visible.
	| "writer"
	// The user has ownership of the calendar. This role has all of the permissions of the writer role with the additional ability to see and manipulate ACLs.
	| "owner";

// The user's access role for this calendar. Read-only. Possible values are:
type AccessRole =
	// The user has no access.
	"none" | AccessRoleWithoutNone;

interface CalendarListListParameters {
	maxResults?: integer | undefined;
	// The minimum access role for the user in the returned entries. Optional. The default is no restriction. Acceptable values are:
	minAccessRole?: AccessRoleWithoutNone | undefined;
	pageToken?: string | undefined;
	showDeleted?: boolean | undefined;
	showHidden?: boolean | undefined;
	syncToken?: string | undefined;
}

interface CalendarListInsertParameters {
	// Parameters
	// Optional query parameters
	colorRgbFormat?: boolean | undefined;

	// CalendarList resource
	resource: CalendarListInput;
}

export interface CalendarListInput {
	// Optional Properties
	backgroundColor?: string | undefined;

	colorId?: string | undefined;
	defaultReminders?:
	| {
		method: ReminderMethod;
		minutes: integer;
	}[]
	| undefined;
	foregroundColor?: string | undefined;
	hidden?: boolean | undefined;
	// Required Properties
	id: string;
	notificationSettings?:
	| {
		notifications: {
			method: string;
			type: NotificationType;
		}[];
	}
	| undefined;
	selected?: boolean | undefined;
	summaryOverride?: string | undefined;
}

export interface CalendarList {
	etag: etag;
	items: CalendarListEntry[];

	kind: "calendar#calendarList";

	/**
	 * Token used to access the next page of this result.
	 * Omitted if no further results are available, in which case nextSyncToken is provided.
	 */
	nextPageToken?: string | undefined;

	/**
	 * Token used at a later point in time to retrieve only the entries that have changed since this result was returned.
	 * Omitted if further results are available, in which case nextPageToken is provided.
	 */
	nextSyncToken?: string | undefined;
}

// The type of notification. Possible values are:
type NotificationType =
	// Notification sent when a new event is put on the calendar.
	| "eventCreation"
	// Notification sent when an event is changed.
	| "eventChange"
	// Notification sent when an event is cancelled.
	| "eventCancellation"
	// Notification sent when an event is changed.
	| "eventResponse"
	// An agenda with the events of the day (sent out in the morning).
	| "agenda";

export interface CalendarListEntry {
	// The effective access role that the authenticated user has on the calendar. Read-only.
	accessRole: AccessRoleWithoutNone;
	backgroundColor?: string | undefined;
	colorId?: string | undefined;
	defaultReminders: {
		method: ReminderMethod;
		minutes: integer;
	}[];
	deleted?: boolean | undefined;
	description?: string | undefined;
	etag: etag;
	foregroundColor?: string | undefined;
	hidden?: boolean | undefined;
	id: string;
	kind: "calendar#calendarListEntry";
	location?: string | undefined;
	notificationSettings?:
	| {
		notifications: {
			method: string;
			type: NotificationType;
		}[];
	}
	| undefined;
	primary?: boolean | undefined;
	selected?: boolean | undefined;
	summary: string;
	summaryOverride?: string | undefined;
	timeZone?: string | undefined;
}

interface CalendarsUpdateParameters {
	calendarId: string;

	// Calendars resource
	// Optional Properties
	description?: string | undefined;
	location?: string | undefined;
	summary?: string | undefined;
	timeZone?: string | undefined;
}

interface CalendarsInsertParameters {
	description?: string | undefined;

	location?: string | undefined;
	// Calendars resource
	// Required Properties
	summary: string;
	timeZone?: string | undefined;
}

interface CalendarsDeleteParameters {
	calendarId: string;
}

export interface Calendar {
	description?: string | undefined;
	etag: etag;
	id: string;
	kind: "calendar#calendar";
	location?: string | undefined;
	summary: string;
	timeZone?: string | undefined;
}

interface EventsGetParameters {
	alwaysIncludeEmail?: boolean | undefined;
	calendarId: string;

	eventId: string;
	maxAttendees?: integer | undefined;
	timeZone?: string | undefined;
}

interface EventsInsertParameters {
	calendarId: string;

	maxAttendees?: integer | undefined;
	// Event resource
	resource: EventInput;
	sendNotifications?: boolean | undefined;

	supportsAttachments?: boolean | undefined;
}

interface EventsUpdateParameters {
	alwaysIncludeEmail?: boolean | undefined;
	calendarId: string;

	eventId: string;
	maxAttendees?: integer | undefined;
	// Event resource
	resource: EventInput;
	sendNotifications?: boolean | undefined;

	supportsAttachments?: boolean | undefined;
}

// calendarId: 'primary' or the calendar from which the event to be deleted
// eventId: the event that need to be deleted from calendar (Event.id from the list/insert response)
interface EventsDeleteParameters {
	calendarId: string;
	eventId: string;

	sendNotifications?: boolean | undefined;
}

interface EventInput {
	// Optional Properties
	anyoneCanAddSelf?: boolean | undefined;
	// Required Properties
	attachments?:
	| {
		fileUrl: string;
	}[]
	| undefined;
	attendees?:
	| {
		additionalGuests?: integer | undefined;
		comment?: string | undefined;
		displayName?: string | undefined;
		email: string;
		optional?: boolean | undefined;
		responseStatus?: AttendeeResponseStatus | undefined;
	}[]
	| undefined;
	colorId?: string | undefined;
	description?: string | undefined;

	end: {
		date?: date | undefined;
		dateTime?: datetime | undefined;
		timeZone?: string | undefined;
	};
	extendedProperties?:
	| {
		private: {
			[key: string]: string;
		};
		shared: {
			[key: string]: string;
		};
	}
	| undefined;
	gadget?:
	| {
		display?: GadgetDisplayMode | undefined;
		height: integer;
		iconLink: string;
		link: string;
		preferences: {
			[key: string]: string;
		};
		title: string;
		type: string;
		width: integer;
	}
	| undefined;
	guestsCanInviteOthers?: boolean | undefined;
	guestsCanSeeOtherGuests?: boolean | undefined;
	id?: string | undefined;
	location?: string | undefined;
	originalStartTime?:
	| {
		date: date;
		dateTime: datetime;
		timeZone: string;
	}
	| undefined;
	recurrence?: string[] | undefined;
	reminders?:
	| {
		overrides: {
			method: string;
			minutes: integer;
		}[];
		useDefault: boolean;
	}
	| undefined;
	sequence?: integer | undefined;
	source?:
	| {
		title: string;
		url: string;
	}
	| undefined;
	start: {
		date?: date | undefined;
		dateTime?: datetime | undefined;
		timeZone?: string | undefined;
	};
	status?: EventStatus | undefined;
	summary?: string | undefined;
	transparency?: EventTransparency | undefined;
	visibility?: EventVisibility | undefined;
}

// The order of the events returned in the result. Optional. The default is an unspecified, stable order.
// Acceptable values are:
type EventsOrder =
	// Order by the start date/time (ascending). This is only available when querying single events (i.e. the parameter singleEvents is True)
	| "startTime"
	// Order by last modification time (ascending).
	| "updated";

// Token obtained from the nextSyncToken field returned on the last page of results from the previous list request.
// It makes the result of this list request contain only entries that have changed since then.
// All events deleted since the previous list request will always be in the result set and it is not allowed to set showDeleted to False.
// There are several query parameters that cannot be specified together with nextSyncToken to ensure consistency of the client state.
// These are:
type SyncToken =
	| "iCalUID"
	| "orderBy"
	| "privateExtendedProperty"
	| "q"
	| "sharedExtendedProperty"
	| "timeMin"
	| "timeMax"
	| "updatedMin";

interface EventsListParameters {
	alwaysIncludeEmail?: boolean | undefined;
	calendarId: string;
	iCalUID?: string | undefined;
	maxAttendees?: integer | undefined;
	maxResults?: integer | undefined;
	orderBy?: EventsOrder | undefined;
	pageToken?: string | undefined;
	privateExtendedProperty?: string | undefined;
	q?: string | undefined;
	sharedExtendedProperty?: string | undefined;
	showDeleted?: boolean | undefined;
	showHiddenInvitations?: boolean | undefined;
	singleEvents?: boolean | undefined;
	syncToken?: SyncToken | undefined;
	timeMax?: datetime | undefined;
	timeMin?: datetime | undefined;
	timeZone?: string | undefined;
	updatedMin?: datetime | undefined;
}

export interface Events {
	// The user's access role for this calendar. Read-only. Possible values are:
	accessRole: AccessRole;
	defaultReminders: {
		method: ReminderMethod;
		minutes: integer;
	}[];
	description: string;
	etag: etag;
	items: Event[];
	kind: "calendar#events";
	nextPageToken?: string | undefined;
	nextSyncToken?: string | undefined;
	summary: string;
	timeZone: string;
	updated: datetime;
}

type etag = string;
type datetime = string;
type date = string;
type integer = number;

// The attendee's response status. Possible values are:
type AttendeeResponseStatus =
	// The attendee has not responded to the invitation.
	| "needsAction"
	// The attendee has declined the invitation.
	| "declined"
	// The attendee has tentatively accepted the invitation.
	| "tentative"
	// The attendee has accepted the invitation.
	| "accepted";

// The gadget's display mode. Optional. Possible values are:
type GadgetDisplayMode =
	// The gadget displays next to the event's title in the calendar view.
	| "icon"
	// The gadget displays when the event is clicked.
	| "chip";

// The method used by this reminder. Possible values are:
type ReminderMethod =
	// Reminders are sent via email.
	| "email"
	// Reminders are sent via SMS. These are only available for Google Apps for Work, Education, and Government customers. Requests to set SMS reminders for other account types are ignored.
	| "sms"
	// Reminders are sent via a UI popup.
	| "popup";

// Status of the event. Optional. Possible values are:
type EventStatus =
	// The event is confirmed. This is the default status.
	| "confirmed"
	// The event is tentatively confirmed.
	| "tentative"
	// The event is cancelled.
	| "cancelled";

// Whether the event blocks time on the calendar. Optional. Possible values are:
type EventTransparency =
	// The event blocks time on the calendar. This is the default value.
	| "opaque"
	// The event does not block time on the calendar.
	| "transparent";

// Visibility of the event. Optional. Possible values are:
type EventVisibility =
	// Uses the default visibility for events on the calendar. This is the default value.
	| "default"
	// The event is public and event details are visible to all readers of the calendar.
	| "public"
	// The event is private and only event attendees may view event details.
	| "private"
	// The event is private. This value is provided for compatibility reasons.
	| "confidential";

export interface Event {
	anyoneCanAddSelf?: boolean | undefined;
	// File attachments for the event. Currently only Google Drive attachments are supported.
	attachments?:
	| {
		fileId: string;
		fileUrl: string;
		iconLink: string;
		mimeType: string;
		title: string;
	}[]
	| undefined;
	// The attendees of the event.
	attendees?:
	| {
		additionalGuests?: integer | undefined;
		comment?: string | undefined;
		displayName?: string | undefined;
		email: string;
		id: string;
		optional?: boolean | undefined;
		organizer: boolean;
		resource: boolean;
		responseStatus: AttendeeResponseStatus;
		self: boolean;
	}[]
	| undefined;
	attendeesOmitted?: boolean | undefined;
	colorId?: string | undefined;
	created: datetime;
	// The creator of the event. Read-only.
	creator: {
		// The creator's name, if available.
		displayName?: string | undefined;

		// The creator's email address, if available.
		email?: string | undefined;

		// The creator's Profile ID, if available.
		id?: string | undefined;

		// Whether the creator corresponds to the calendar on which this copy of the event appears. Read-only. The default is False.
		self?: boolean | undefined;
	};
	description: string;
	// The (exclusive) end time of the event. For a recurring event, this is the end time of the first instance.
	end: {
		// The date, in the format "yyyy-mm-dd", if this is an all-day event.
		date?: date | undefined;

		// The time, as a combined date-time value (formatted according to RFC3339).
		// A time zone offset is required unless a time zone is explicitly specified in timeZone.
		dateTime?: datetime | undefined;

		// The time zone in which the time is specified. (Formatted as an IANA Time Zone Database name, e.g. "Europe/Zurich".)
		// For recurring events this field is required and specifies the time zone in which the recurrence is expanded.
		// For single events this field is optional and indicates a custom time zone for the event start/end.
		timeZone?: string | undefined;
	};
	//     Whether the end time is actually unspecified. An end time is still provided for compatibility reasons, even if this attribute is set to True.
	// The default is False.
	endTimeUnspecified?: boolean | undefined;
	etag: etag;

	// Extended properties of the event.
	extendedProperties?:
	| {
		private: {
			[key: string]: string;
		};
		shared: {
			[key: string]: string;
		};
	}
	| undefined;

	// A gadget that extends this event.
	gadget?:
	| {
		display?: GadgetDisplayMode | undefined;
		height?: integer | undefined;
		iconLink: string;
		link: string;
		preferences: {
			[key: string]: string;
		};
		title: string;
		type: string;
		width?: integer | undefined;
	}
	| undefined;

	guestsCanInviteOthers?: boolean | undefined;

	guestsCanModify?: boolean | undefined;

	guestsCanSeeOtherGuests?: boolean | undefined;

	// An absolute link to the Google+ hangout associated with this event. Read-only.
	hangoutLink?: string | undefined;

	htmlLink: string;

	iCalUID: string;

	id: string;
	kind: "calendar#event";
	location?: string | undefined;
	// Whether this is a locked event copy where no changes can be made to the main event fields "summary", "description", "location", "start", "end" or "recurrence". The default is False. Read-Only.
	locked?: boolean | undefined;

	// The organizer of the event.
	organizer: {
		// The organizer's name, if available.
		displayName?: string | undefined;

		// The organizer's email address, if available.
		email?: string | undefined;

		// The organizer's Profile ID, if available.
		id?: string | undefined;

		// Whether the organizer corresponds to the calendar on which this copy of the event appears. Read-only. The default is False.
		self?: boolean | undefined;
	};

	// Whether the organizer corresponds to the calendar on which this copy of the event appears. Read-only. The default is False.
	originalStartTime?:
	| {
		date: date;
		dateTime: datetime;
		timeZone?: string | undefined;
	}
	| undefined;

	privateCopy?: boolean | undefined;

	recurrence: string[];

	// For an instance of a recurring event, this is the id of the recurring event to which this instance belongs. Immutable.
	recurringEventId?: string | undefined;

	reminders: {
		overrides?:
		| {
			method: ReminderMethod;
			minutes: integer;
		}[]
		| undefined;
		useDefault: boolean;
	};
	sequence: integer;
	// Source from which the event was created. For example, a web page, an email message or any document identifiable by an URL with HTTP or HTTPS scheme.
	// Can only be seen or modified by the creator of the event.
	source?:
	| {
		title: string;
		url: string;
	}
	| undefined;
	status?: EventStatus | undefined;
	updated: datetime;

	summary?: string;

	visibility?: EventVisibility | undefined;

	// The (inclusive) start time of the event. For a recurring event, this is the start time of the first instance.
	start: {
		// The date, in the format "yyyy-mm-dd", if this is an all-day event.
		date?: date | undefined;

		// The time, as a combined date-time value (formatted according to RFC3339).
		// A time zone offset is required unless a time zone is explicitly specified in timeZone.
		dateTime?: datetime | undefined;

		// The time zone in which the time is specified. (Formatted as an IANA Time Zone Database name, e.g. "Europe/Zurich".)
		// For recurring events this field is required and specifies the time zone in which the recurrence is expanded.
		// For single events this field is optional and indicates a custom time zone for the event start/end.
		timeZone?: string | undefined;
	};

	transparency?: EventTransparency | undefined;
}
