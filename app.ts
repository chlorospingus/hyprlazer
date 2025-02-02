import { App } from "astal/gtk3"
import style from "./style.scss"
import Bar from "./widget/Bar"
import Hyprland from "gi://AstalHyprland"

const hyprland = Hyprland.get_default()

App.start({
    css: style,
	icons: "/home/protoshark/.config/ags/assets/",
    main() {
		hyprland.monitors.map((monitor) => Bar(monitor))
    },
})
