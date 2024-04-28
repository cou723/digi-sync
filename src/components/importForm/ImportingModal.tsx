import { Box, LinearProgress, Modal, Typography } from "@mui/material";
import React from "react";

type Props = {
	imported: number;
	isOpen: boolean;
	label?: string;
	onClose?: () => void;
	total: number;
};

const style = {
	bgcolor: "background.paper",
	boxShadow: 24,
	left: "50%",
	p: 4,
	position: "absolute" as const,
	top: "50%",
	transform: "translate(-50%, -50%)",
	width: 400,
};

const ImportingModal = ({ total, imported, onClose, isOpen, label }: Props) => {
	return (
		<Modal
			aria-describedby='modal-modal-description'
			aria-labelledby='modal-modal-title'
			onClose={onClose}
			open={isOpen}
		>
			<Box sx={style}>
				<Typography component='h2' id='modal-modal-title' variant='h6'>
					インポート中...
				</Typography>
				<Typography id='modal-modal-description' sx={{ mt: 2 }}>
					{label ?? `DigiSyncから${total}件の授業をインポート中です。`}
				</Typography>
				<LinearProgress
					sx={{ mt: 2 }}
					value={(imported / total) * 100}
					variant='determinate'
				/>
			</Box>
		</Modal>
	);
};

export default ImportingModal;
