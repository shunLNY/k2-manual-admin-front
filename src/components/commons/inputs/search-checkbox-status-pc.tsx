import classNames from "classnames";
import search from "../lists/list-filter-pc.module.scss";

type Props = {
	label: string;
	color: string;
	borderLeft?: boolean;
	btnWidth?: string;
	statusInfo?: boolean;
};

export default function SearchCheckboxStatusPC(props: Props) {
	let { label, color, borderLeft, btnWidth, statusInfo } = props;

	return (
		<>
			{borderLeft ? (
				<div
					className={`${statusInfo ? " " : "d-flex"} ${
						search.checkbox_text
					} ${search.border_left}`}
				>
					<span className={`${search["border_" + color]}`}></span>
					{label}
					{statusInfo && (
						<div className={search.status_info}>{statusInfo}</div>
					)}
				</div>
			) : (
				<div
					className={classNames(
						{ [search.border_left]: borderLeft },
						search.checkbox_text,
						search["border_" + color],
						search["custom_" + btnWidth],
						statusInfo ? " " : "d-flex"
					)}
				>
					<span className={search.label_txt}>{label}</span>
					{statusInfo && (
						<div className={search.status_info}>{statusInfo}</div>
					)}
				</div>
			)}
		</>
	);
}
