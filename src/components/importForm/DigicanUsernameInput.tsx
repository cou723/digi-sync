import React from "react";

import RhfTextField from "@/components/utils/rhfTextField";

// TODO: any祭りやめたいし、外だしする必要なさそう。当時はたぶんcustom hookうまく使えてなくて、コンポーネント小さくするために分けたんだろうけど、これ使ってる元の方でちゃんとカスタムフックした方がいい気がする。
type Props = {
	appState: any;
	errors: any;
	register: any;
};

function DigicanUsernameInput({ appState, errors, register }: Props) {
	return (
		<RhfTextField
			disabled={appState != "ready"}
			error_message={errors.username?.message}
			label='デジキャンのユーザーネーム(学籍番号)'
			name='username'
			register={register}
		/>
	);
}

export default DigicanUsernameInput;
