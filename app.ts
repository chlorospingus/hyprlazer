import { App } from "astal/gtk3"
import style from "./style.scss"
import Bar from "./widget/Bar"
import Hyprland from "gi://AstalHyprland"
import launcher from "./widget/launcher"

const hyprland = Hyprland.get_default()

App.start({
    css: style,
	icons: "/home/spingus/.config/ags/assets/",
	requestHandler: (request: string, res: (response: any) => void) => {
		if (request === "launch") {
			if (launcher()) {
				res("Opening launcher")
			} else {
				res("Closing launcher")
			}
			return
		}
		res("Unknown command")
	},
    main: () => {
		hyprland.monitors.map((mon) => {
			Bar(mon)
		})
    },
})
