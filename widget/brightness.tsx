import { bind, exec, execAsync, monitorFile, readFile, writeFile } from "astal"
import { Astal, Gtk, Gdk, Widget } from "astal/gtk3";
import { Box } from "astal/gtk3/widget";
import { popup } from "./popup"
const { TOP, LEFT } = Astal.WindowAnchor

const backlight = "/sys/class/backlight/intel_backlight/brightness"

function brightnessSlider(display) {
	let slider: Widget.Slider = <box vertical={true} className="volSlider">
		<box>
			<icon 
				icon="display"
				css="font-size: 32px; margin-right: 6px;"
			/>
			<label>{display}</label>
		</box>
		<slider
			halign={Gtk.Align.START}
			valign={Gtk.Align.CENTER}
			min={0}
			max={19393}
			value={Number(readFile(backlight))}
			onDragged={(self) => {
				exec(`brightnessctl s ${self.value}`)
			}}
			setup={(self) => {
				/*
				monitorFile(backlight, (file, event) => {
					self.value = Number(readFile(file))
				})
				*/
			}}
		/>
	</box>
	return slider
}

function sunset() {
	try {
		exec("pgrep -x hyprsunset")
		return true
	}
	catch (e) {
		return false
	}
}

function BrightWindow() {
	let toggleIndicator: Box = <box 
		halign={Gtk.Align.END}
		valign={Gtk.Align.CENTER}
		className={(sunset()) ? "toggleIndicator active" : "toggleIndicator inactive"}
	/>  
	return <window
		className="popupWindow"
		anchor={TOP | LEFT}
		namespace="lazerpopup">
		<box
			vertical={true}
			css="margin-left: 130px;">
			{brightnessSlider("DP-1")}
			<button 
				className="toggleButton"
				onClicked={(self) => {
					toggleIndicator.toggleClassName("active", !sunset())
					execAsync("/home/protoshark/.config/scripts/sunset-toggle.sh")
						.then((out) => (console.log(out)))
						.catch((out) => (console.log(out)))
				}}	
			>
				<box>
					<label hexpand halign={Gtk.Align.START}>Night Light</label>
					{toggleIndicator}
				</box>
			</button>
		</box>
	</window>
}

export default function brightness() {
	let brightnessBar = <levelbar
		valign={Gtk.Align.CENTER}
		vertical={true}
		inverted={true}
		minValue={0}
		maxValue={19393}
		heightRequest={24}
		value={Number(readFile("/sys/class/backlight/intel_backlight/brightness"))}
	/>
	{monitorFile("/sys/class/backlight/intel_backlight/brightness", (file, event) => {
		brightnessBar.value = readFile(file)
	})}
	return <button
		className="scroller"
		onScroll={(self, diff) => {
			brightnessBar.value -= diff.delta_y*50
			exec(`brightnessctl s ${brightnessBar.value}`)
		}}
		onClicked={(self) => {
			if (popup.state !== "brightness") {
				if (popup.window) {
					popup.window.destroy()
					popup.window = null
				}
				popup.window = BrightWindow();
				popup.state = "brightness"
				self.toggleClassName("selected", true)
				self.hook(popup.window, "destroy", () => {
					self.toggleClassName("selected", false)
				})
			} else {
				if (popup.window) {
					popup.window.destroy()
					popup.window = null
				}
				popup.state = ""
			}
		}}>
		<box>
			<icon
				icon="brightness-symbolic"
				css="font-size: 22px; color: white;"
			/>
			{brightnessBar}
		</box>
	</button>
}
