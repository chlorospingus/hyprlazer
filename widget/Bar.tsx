import { App, Astal, Gtk, Gdk, Widget } from "astal/gtk3"
import { Variable } from "astal"
import Hyprland from "gi://AstalHyprland"
import battery from "./battery"
import workspaces from "./workspaces"
import volume from "./volume"
import brightness from "./brightness"
import client from "./client"
import player from "./player"
import bluetooth from "./bluetooth"
import notifs from "./notif"
import power from "./power"

const time = Variable("").poll(1000, "date +'%a %b %d · %H:%M'")

export default function Bar(monitor: Hyprland.Monitor) {
    const { TOP, LEFT, RIGHT } = Astal.WindowAnchor

    return <window
        className="bar"
		namespace="bar"
		monitor={monitor.id}
        exclusivity={Astal.Exclusivity.IGNORE}
        anchor={TOP | LEFT | RIGHT}
		layer={Astal.Layer.TOP}
        application={App}>
		<eventbox
			onHover={self => self.css="box-shadow: 0 0 16px 4px black;"}
		><centerbox heightRequest={36}>
			<box>
				{power()}
				{battery()}
				{volume()}
				{brightness()}
				{bluetooth()}
			</box>
			{workspaces(monitor)}
			<box halign={Gtk.Align.END}>
				{player()}
				<button><box>
					<label
						className="innerButton"
						label={time()}
					/>
				</box></button>
				{notifs()}
			</box>
        </centerbox></eventbox>
    </window>
}
