import LunchDiningIcon from "@mui/icons-material/LunchDining";
import { Drawer, List, ListItem, ListItemButton, Fab } from "@mui/material";
import { useRouter } from "next/router";
import React, { useState } from "react";

type Props = {
	pages: { display: string; link: string }[];
};

const style = {
	bottom: 20,
	left: "auto",
	margin: 0,
	right: 20,
	top: "auto",
};

export default React.memo(function FloatMenu({ pages }: Props) {
	const [isOpenDrawer, setIsOpenDrawer] = useState(false);
	const router = useRouter();
	const toggleDrawer = (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
		if (
			event.type === "keydown" &&
			((event as React.KeyboardEvent).key === "Tab" ||
				(event as React.KeyboardEvent).key === "Shift")
		) {
			return;
		}

		setIsOpenDrawer(open);
	};

	function onClick() {
		setIsOpenDrawer(!isOpenDrawer);
	}

	return (
		<>
			<Fab
				aria-label='add'
				color='primary'
				onClick={onClick}
				style={style}
				sx={{ position: "fixed" }}
			>
				<LunchDiningIcon />
			</Fab>
			<Drawer anchor='bottom' onClose={toggleDrawer(false)} open={isOpenDrawer}>
				<List>
					{pages.map((page) => (
						<ListItem disablePadding key={page.display}>
							<ListItemButton
								key={page.display}
								onClick={() => router.push(page.link)}
								sx={{
									my: 1,
								}}
							>
								{page.display}
							</ListItemButton>
						</ListItem>
					))}
				</List>
			</Drawer>
		</>
	);
});
