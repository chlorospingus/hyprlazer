import { bind } from "astal"
import Bluetooth from "gi://AstalBluetooth"
import { popup } from "./popup"
import { Astal, Gtk, Widget } from "astal/gtk3"

const { TOP, LEFT } = Astal.WindowAnchor

const bluetooth = Bluetooth.get_default()

function bluetoothItem(device: Bluetooth.Device) {
	return <button className="toggleButton">
		<overlay overlay={new Widget.Box({
			className: "toggleIndicator",
			halign: Gtk.Align.END,
			valign: Gtk.Align.CENTER,
		})}>
			<box>
				<icon icon={device.icon} css="font-size: 32px;" />
				<label>{device.alias ?? device.name}</label>
			</box>
		</overlay>
	</button>
}

function bluetoothWindow() {
	return <window
		anchor={ TOP | LEFT }
		marginLeft={170}
		namespace="lazerpopup"
		className="popupWindow">
		<box vertical={true}>
			{bluetooth.devices.map(dev => bluetoothItem(dev))}
		</box>
	</window>
}

export default function bluetoothWidget() {
	return <button
		onClicked={(self) => {
			if (popup.state !== "bluetooth") {
				if (popup.window) {
					popup.window.destroy()
					popup.window = null
				}
				popup.window = bluetoothWindow();
				popup.state = "bluetooth"
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
		}}
	><box>
		<icon
			icon={bind(bluetooth, "isConnected").as(c =>
				c ? "lazer-bluetooth-symbolic" : "nobluetooth-symbolic"
			)}
			css="font-size: 24px;"
		/>
	</box></button>
} 
