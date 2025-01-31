import Wp from "gi://AstalWp"
import Hyprland from "gi://AstalHyprland";
import { bind } from "astal"
import { Astal, Gtk, Gdk } from "astal/gtk3";
import { popup } from "./popup"
const { TOP, LEFT } = Astal.WindowAnchor

const audio = Wp.get_default()?.audio;
const hyprland = Hyprland.get_default()

function speakerIcon(icon: string): string {
	switch (icon) {
		case "audio-headset-bluetooth":
			return "audio-headset"
		case "audio-card-analog-pci":
			return "audio-speakers"
		default:
			return "speakers"
	}
}

function speakerVolume(speaker: Wp.Endpoint) {
	return <box vertical={true} className="volSlider">
		<box>
			<icon 
				icon={speakerIcon(speaker.icon)}
				css="font-size: 32px;"
			/>
			<label>{speaker.description}</label>
		</box>
		<slider
			halign={Gtk.Align.START}
			valign={Gtk.Align.CENTER}
			min={0}
			max={1}
			value={bind(speaker, "volume").as((s) => {
				return s
			})}
			onDragged={(self) => {
				speaker.volume = self.value
			}}
		/>
	</box>
}

function VolWindow() {
	return <window
		className="popupWindow"
		anchor={TOP | LEFT}
		namespace="lazerpopup">
		<box
			vertical={true}
			css="margin-left: 70px;">
			{bind(audio, "speakers").as(speakers => speakers.map(s => speakerVolume(s)))}
		</box>
	</window>
}

export default function volume() {
	return <button
		className="scroller"
		onScroll={(self, diff) => {
			audio.defaultSpeaker.volume -= diff.delta_y/20
		}}
		onClicked={(self) => {
			if (popup.state !== "volume") {
				if (popup.window !== null) {
					popup.window.destroy()
					popup.window = null
				}
				popup.window = VolWindow();
				popup.state = "volume"
				self.toggleClassName("selected", true)
				self.hook(popup.window, "destroy", () => {
					self.toggleClassName("selected", false)
				})
			} else {
				popup.window.destroy()
				popup.window = null
				popup.state = ""
			}}}
		>
		<box>
			<icon
				icon="myvolume-symbolic"
				css="font-size: 24px; color: white;"
			/>
			<levelbar
				valign={Gtk.Align.CENTER}
				vertical={true}
				inverted={true}
				minValue={0}
				maxValue={1}
				heightRequest={24}
				value={bind(audio.defaultSpeaker, "volume").as((v) => v)}
			/>
		</box>
	</button>
}
