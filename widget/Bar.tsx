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

const time = Variable("").poll(1000, "date +'%a %b %d · %H:%M'")

export default function Bar(monitor: Hyprland.Monitor) {
    const { TOP, LEFT, RIGHT } = Astal.WindowAnchor

    return <window
        className="bar"
		namespace="bar"
		monitor={monitor.id}
        exclusivity={Astal.Exclusivity.IGNORE}
        anchor={TOP | LEFT | RIGHT}
		heightRequest={36}
		layer={Astal.Layer.TOP}
        application={App}>
        <centerbox>
			<box>
				{battery()}
				{volume()}
				{brightness()}
				{bluetooth()}
			</box>
			{workspaces(monitor)}
			<box halign={Gtk.Align.END}>
				{player()}
				{client()}
				<button><box>
					<label
						className="innerButton"
						label={time()}
					/>
				</box></button>
				{notifs()}
			</box>
        </centerbox>
    </window>
}
