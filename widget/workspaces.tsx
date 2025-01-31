import { bind } from "astal"
import { Gdk, Gtk, Widget } from "astal/gtk3"
import Hyprland from "gi://AstalHyprland"

const hyprland = Hyprland.get_default()

function newWorkspace(ws: number, monitor: number) {
	return <overlay
		halign={Gtk.Align.START}
		overlays={[
			new Widget.Button({
				className: "workspaceButton",
				visible: true,
				onClick: () => {
					hyprland.dispatch("workspace", ws.toString())
				}
			}, new Widget.Box({
				halign: Gtk.Align.FILL,
				valign: Gtk.Align.FILL,
			}, new Widget.Box({
				valign: Gtk.Align.CENTER,
				halign: Gtk.Align.CENTER,
				className: bind(hyprland, "workspaces").as(wss => {
						let myws = wss.find(w => w.id === ws)
						return (myws !== undefined && myws.monitor.id === monitor)
							? "active" : "inactive"
				}),
				css: bind(hyprland, "focusedWorkspace").as(fws => {
					return (fws.id === ws)
						? "border-color: #00ffaa"
						: "border-color: #ffffff"
				})
			}))),
		]}>
		<box className="workspaceContainer" />
	</overlay>
}

export default function workspaces(monitor: Hyprland.Monitor) {
	return <overlay
		overlay={new Widget.Box({
			halign: Gtk.Align.START,
			valign: Gtk.Align.END,
			className: "workspaceIndicator",
			css: bind(hyprland, "focusedWorkspace").as(ws => {
				return "margin-left: " + (24+(ws.id-1)*32) + "px;"
			})
		})}>
		<box
			className="workspaces"
			halign={Gtk.Align.START}
			visible={true}
			setup={(self) => {
				for (let i = 1; i <= 9; i++) {
					self.add(newWorkspace(i, monitor.id))
				}
			}}/>
	</overlay>
}
