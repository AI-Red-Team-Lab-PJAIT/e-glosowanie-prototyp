import type { SVGProps } from "react";

// Ikony rysowane ręcznie, w grubości kreski z prototypu mobywatel.ai (MIT).
type P = SVGProps<SVGSVGElement>;

const base = {
	viewBox: "0 0 24 24",
	fill: "none",
	stroke: "currentColor",
	strokeWidth: 1.7,
	strokeLinecap: "round",
	strokeLinejoin: "round",
	"aria-hidden": true,
} as const;

export const Chevron = (p: P) => (
	<svg {...base} strokeWidth={2} {...p}>
		<path d="m9.5 6 6 6-6 6" />
	</svg>
);

export const Wstecz = (p: P) => (
	<svg {...base} strokeWidth={2.4} {...p}>
		<path d="M15 5 8 12l7 7" />
	</svg>
);

export const Szukaj = (p: P) => (
	<svg {...base} strokeWidth={2} {...p}>
		<circle cx="10.5" cy="10.5" r="6" />
		<path d="m15 15 4.5 4.5" />
	</svg>
);

export const Info = (p: P) => (
	<svg {...base} {...p}>
		<circle cx="12" cy="12" r="9" />
		<path d="M12 11v5.5M12 7.6v.2" />
	</svg>
);

export const Ok = (p: P) => (
	<svg {...base} strokeWidth={2.2} {...p}>
		<circle cx="12" cy="12" r="9.2" />
		<path d="m8 12.4 2.8 2.8L16.2 9.6" />
	</svg>
);

export const Zamknij = (p: P) => (
	<svg {...base} strokeWidth={2} {...p}>
		<path d="M6.5 6.5l11 11M17.5 6.5l-11 11" />
	</svg>
);

export const Lancuch = (p: P) => (
	<svg {...base} {...p}>
		<rect x="3" y="8.5" width="8" height="7" rx="2" />
		<rect x="13" y="8.5" width="8" height="7" rx="2" />
		<path d="M11 12h2" />
	</svg>
);

// Tab bar
export const TabDokumenty = (p: P) => (
	<svg {...base} {...p}>
		<rect x="4" y="8" width="16" height="11.5" rx="2.2" />
		<path d="M6 5.2h12M7.5 2.8h9" />
	</svg>
);
export const TabUslugi = (p: P) => (
	<svg viewBox="0 0 24 24" aria-hidden="true" {...p}>
		<path
			fill="currentColor"
			d="M2.8 6.6A2.3 2.3 0 0 1 5.1 4.3h4.1c.6 0 1.2.3 1.6.7l1.4 1.5h6.7a2.3 2.3 0 0 1 2.3 2.3v9.2a2.3 2.3 0 0 1-2.3 2.3H5.1a2.3 2.3 0 0 1-2.3-2.3z"
		/>
	</svg>
);
export const TabUslugiObrys = (p: P) => (
	<svg {...base} {...p}>
		<path d="M3.5 6.8a2 2 0 0 1 2-2h3.7c.5 0 1 .2 1.4.6l1.5 1.6h6.4a2 2 0 0 1 2 2v8.7a2 2 0 0 1-2 2h-13a2 2 0 0 1-2-2z" />
	</svg>
);
export const TabKodQr = (p: P) => (
	<svg {...base} {...p}>
		<path d="M4 8V6a2 2 0 0 1 2-2h2M16 4h2a2 2 0 0 1 2 2v2M20 16v2a2 2 0 0 1-2 2h-2M8 20H6a2 2 0 0 1-2-2v-2" />
		<path d="M9 9.5v5M12 8v8M15 9.5v5" />
	</svg>
);
export const TabWiecej = (p: P) => (
	<svg {...base} {...p}>
		<circle cx="7.5" cy="7.5" r="3" />
		<circle cx="16.5" cy="7.5" r="3" />
		<circle cx="7.5" cy="16.5" r="3" />
		<circle cx="16.5" cy="16.5" r="3" />
	</svg>
);

// Usługi: kolorowe glify jak na liście w aplikacji.
const fill = { viewBox: "0 0 24 24", "aria-hidden": true } as const;

export const UMandaty = (p: P) => (
	<svg {...fill} {...p}>
		<rect
			x="3"
			y="5"
			width="15"
			height="11"
			rx="2"
			fill="currentColor"
			transform="rotate(-12 10 10)"
		/>
		<rect x="6.5" y="9" width="14.5" height="10.5" rx="2" fill="currentColor" opacity=".55" />
	</svg>
);
export const UPesel = (p: P) => (
	<svg {...fill} {...p}>
		<path
			fill="currentColor"
			d="M12 2.5 4.5 5.3v6c0 4.6 3.1 8.6 7.5 10.2 4.4-1.6 7.5-5.6 7.5-10.2v-6z"
		/>
		<path
			d="m8.7 12 2.3 2.3 4.4-4.6"
			stroke="#fff"
			strokeWidth="2"
			fill="none"
			strokeLinecap="round"
			strokeLinejoin="round"
		/>
	</svg>
);
export const UPunkty = (p: P) => (
	<svg {...fill} {...p}>
		<path fill="currentColor" d="M3 11.5c0-2.6 4-4.5 9-4.5s9 1.9 9 4.5V13H3z" />
		<rect x="5" y="14" width="14" height="4.5" rx="2" fill="currentColor" opacity=".55" />
		<circle cx="12" cy="10.5" r="2" fill="#fff" />
	</svg>
);
export const UPojazd = (p: P) => (
	<svg {...fill} {...p}>
		<path
			fill="currentColor"
			d="M5 10.5 6.6 6.4A2 2 0 0 1 8.5 5h7a2 2 0 0 1 1.9 1.4l1.6 4.1a2 2 0 0 1 1 1.7V17a1 1 0 0 1-1 1h-1.5v1.5h-2.5V18h-6v1.5H6.5V18H5a1 1 0 0 1-1-1v-4.8a2 2 0 0 1 1-1.7z"
		/>
		<circle cx="7.5" cy="14" r="1.3" fill="#fff" />
		<circle cx="16.5" cy="14" r="1.3" fill="#fff" />
	</svg>
);
export const UPowietrze = (p: P) => (
	<svg {...base} {...p}>
		<path d="M3 9h11a2.5 2.5 0 1 0-2.5-2.5M3 13h15a2.5 2.5 0 1 1-2.5 2.5M3 17h8" />
	</svg>
);
export const URecepta = (p: P) => (
	<svg {...fill} {...p}>
		<path
			fill="currentColor"
			d="M12 20.5S3.5 15.4 3.5 9.4A4.6 4.6 0 0 1 12 6.9a4.6 4.6 0 0 1 8.5 2.5c0 6-8.5 11.1-8.5 11.1z"
		/>
		<path
			d="M6.5 11.5h2.6l1.4-2.6 2 5 1.5-2.4h3.5"
			stroke="#fff"
			strokeWidth="1.6"
			fill="none"
			strokeLinecap="round"
			strokeLinejoin="round"
		/>
	</svg>
);
export const UPeselSprawdz = (p: P) => (
	<svg {...fill} {...p}>
		<rect x="3" y="5" width="18" height="14" rx="2.5" fill="currentColor" />
		<circle cx="8.5" cy="11" r="2" fill="#fff" />
		<path
			d="M5.8 16c.5-1.5 1.5-2.2 2.7-2.2s2.2.7 2.7 2.2M13.5 10h4.5M13.5 13.5h3"
			stroke="#fff"
			strokeWidth="1.5"
			fill="none"
			strokeLinecap="round"
		/>
	</svg>
);
export const UBilet = (p: P) => (
	<svg {...fill} {...p}>
		<path
			fill="currentColor"
			d="M3 7.5A1.5 1.5 0 0 1 4.5 6h15A1.5 1.5 0 0 1 21 7.5V10a2 2 0 0 0 0 4v2.5a1.5 1.5 0 0 1-1.5 1.5h-15A1.5 1.5 0 0 1 3 16.5V14a2 2 0 0 0 0-4z"
		/>
		<path d="M14.5 7.5v9" stroke="#fff" strokeWidth="1.4" strokeDasharray="1.6 1.6" />
	</svg>
);
export const UZus = (p: P) => (
	<svg {...fill} {...p}>
		<rect x="3" y="5" width="13" height="11" rx="2.2" fill="currentColor" />
		<path fill="currentColor" opacity=".55" d="m17 9 4-2.5v9L17 13z" />
		<path d="M6 18.5h7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
	</svg>
);
export const UWybory = (p: P) => (
	<svg {...fill} {...p}>
		<path fill="currentColor" opacity=".55" d="M4 11.5 8 9h8l4 2.5z" />
		<rect x="4" y="11.5" width="16" height="9" rx="1.5" fill="currentColor" />
		<rect
			x="9"
			y="3.5"
			width="6"
			height="8"
			rx=".8"
			fill="currentColor"
			opacity=".8"
			transform="rotate(8 12 7.5)"
		/>
		<path d="M8.5 11.5h7" stroke="#fff" strokeWidth="1.4" strokeLinecap="round" />
	</svg>
);
