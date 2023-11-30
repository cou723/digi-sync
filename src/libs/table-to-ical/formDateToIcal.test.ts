import { dayjsWrapper } from "./dayjs";
import formDateToIcal from "./formDateToIcal";

describe("FormDateToIcal", () => {
	it("should convert API event data to the expected format", () => {
		const now = new Date().toString();
		expect(
			formDateToIcal({
				allDay: false,
				className: "test",
				editable: true,
				end: now,
				id: "10",
				start: now,
				title: "test",
			}),
		).toEqual({
			end: dayjsWrapper(now).add(90, "minute").toDate(),
			location:
				"デジタルハリウッド大学, 日本、〒101-0062 東京都千代田区神田駿河台４丁目６ 御茶ノ水ソラシティアカデミア 3F/4F",
			start: dayjsWrapper(now).toDate(),
			summary: "test",
			timezone: dayjsWrapper.tz.guess(),
		});
	});
});
