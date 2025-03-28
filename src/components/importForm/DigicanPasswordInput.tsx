import React from "react";

import RhfTextField from "@/components/utils/rhfTextField";

// TODO: any祭りやめたいし、外だしする必要なさそう。当時はたぶんcustom hookうまく使えてなくて、コンポーネント小さくするために分けたんだろうけど、これ使ってる元の方でちゃんとカスタムフックした方がいい気がする。
type Props = {
	appState: any;
	errors: any;
	register: any;
};
const DigicanPasswordInput = ({ appState, errors, register }: Props) => {
	return (
		<RhfTextField
			disabled={appState != "ready"}
			error_message={errors.password?.message}
			label='デジキャンのパスワード'
			name='password'
			register={register}
			type='password'
		/>
	);
};

export default DigicanPasswordInput;
