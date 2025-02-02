import Battery from "gi://AstalBattery"
import PowerProfiles from "gi://AstalPowerProfiles"
import Hyprland from "gi://AstalHyprland"
import { popup } from "./popup"
import { Astal, Gtk, Widget } from "astal/gtk3"
import { mergeBindings } from "/usr/share/astal/gjs/_astal"
import { bind } from "astal"

const hyprland = Hyprland.get_default()
const batt = Battery.get_default()
const powerProfiles = PowerProfiles.get_default()

const percentage = bind(batt, "percentage").as((p) => `${Math.round(p*100)}%`)
const charging = bind(batt, "charging")
const toFull = bind(batt, "timeToFull").as((t) => t.toString())
const toEmpty = bind(batt, "timeToEmpty").as((t) => t.toString())

function profileButton(label: string, profile: string) {
	return <button className="toggleButton" onClicked={(self) => {
		powerProfiles.activeProfile = profile
	}}>
		<overlay overlay={new Widget.Box({
				halign: Gtk.Align.END,
				valign: Gtk.Align.CENTER,
				className: bind(powerProfiles, "activeProfile").as((p) => 
					(p === profile)
						? "toggleIndicator active"
						: "toggleIndicator inactive"
				)
			})}>
			<label halign={Gtk.Align.START}>{label}</label>
		</overlay>
	</button>
}

function BattWindow() {
	const { TOP, LEFT } = Astal.WindowAnchor
	return <window
		className="popupWindow"
		namespace="lazerpopup"
		monitor={hyprland.focusedMonitor.id}
		anchor={TOP | LEFT}
		layer={Astal.Layer.TOP}>
		<box
			className="popupBattery"
			vertical={true}
			spacing={12}>
			<box spacing={10}>
				<overlay overlay={new Widget.Label({
					halign: Gtk.Align.CENTER,
					valign: Gtk.Align.CENTER,
					className: "percentage",
					label: bind(batt, "energy").as(e => `${e}Wh`),
				})}>
					<levelbar
						className="batteryLevel"
						minValue={0}
						maxValue={1}
						inverted={true}
						widthRequest={96}
						vertical={true}
						value={bind(batt, "percentage").as(c => c)}
					/>
				</overlay>
				<box vertical={true} spacing={10}>
					<overlay overlay={new Widget.Box({
						halign: Gtk.Align.CENTER,
						valign: Gtk.Align.CENTER,
						vertical: true,
						children: [
							new Widget.Label({
								className: "bigText",
								label: bind(batt, "energyRate").as((w) => `${w}W`),
							}),
							new Widget.Label({
								className: "smallText",
								label: bind(batt, "charging").as(
									(c) => c ? "Charging" : "Discharging"
								),
							}),
						]
					})}>
						<box className="info" />
					</overlay>
					<overlay overlay={new Widget.Box({
						halign: Gtk.Align.CENTER,
						valign: Gtk.Align.CENTER,
						vertical: true,
						children: [
							new Widget.Label({
								className: "status",
								label: mergeBindings([charging, toFull, toEmpty]).as(
									(b) => {
										let s = (b[0] ? b[1] : b[2])
										return `${Math.floor(s/3600)}H ${Math.floor((s%3600)/60)}M`
									}
								),
							}),
							new Widget.Label({
								className: "title",
								label: charging.as(c => c ? "To full" : "To empty"),
							}),
						]
					})}>
						<box className="info" />
					</overlay>
				</box>
			</box>
			<box
				vertical={true}
				spacing={4}>
				{profileButton("Power Saver", "power-saver")}
				{profileButton("Balanced", "balanced")}
				{profileButton("Performance", "performance")}
			</box>
		</box>
	</window>
}

export default function battery() {
	return <button
		className="battery"
		halign={Gtk.Align.START}
		onClicked={(self) => {
			if (popup.state !== "battery") {
				if (popup.window !== null) {
					popup.window.destroy()
					popup.window = null
				}
				popup.window = BattWindow();
				popup.state = "battery"
				self.toggleClassName("selected", true)
				self.hook(popup.window, "destroy", () => {
					self.toggleClassName("selected", false)
				})
			} else {
				popup.window.destroy()
				popup.window = null
				popup.state = ""
			}}}
		><box>
			<icon
				valign={Gtk.Align.CENTER}
				css="font-size: 24px; margin-right: 2px;"
				icon={mergeBindings([charging, bind(powerProfiles, "activeProfile")]).as(
					b => {
						if (b[0]) return "battery-charging-symbolic"
						return `${b[1]}-symbolic`
					}
				)}>
			</icon>
			<label css="margin-top: 2px;">{percentage}</label>
		</box>
	</button>
}
