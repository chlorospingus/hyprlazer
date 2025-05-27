import { bind } from "astal"
import Hyprland from "gi://AstalHyprland"
import Apps from "gi://AstalApps"
import { Gtk, Widget } from "astal/gtk3"
import { Overlay } from "astal/gtk3/widget"
const hyprland = Hyprland.get_default()
const apps = new Apps.Apps({
	entryMultiplier: 2,
	categories_multiplier: 0,
	description_multiplier: 0,
	executable_multiplier: 0,
	name_multiplier: 0,
	keywordsMultiplier: 0,
})

function NewClient(client: Hyprland.Client) {
	let appsClass
	if (!client) {
		appsClass = null
	}
	else if (client.class === "soffice") {
		appsClass = apps.list.find(app => app.wmClass === "libreoffice-startcenter")
	} else {
		appsClass = apps.list.find(app => app.wmClass === client?.class)
	}
	return <box halign={Gtk.Align.END} className="clientLabel" visible={true}>
		<icon 
			icon={appsClass?.iconName ?? "hyprland"}
			css="font-size: 24px; margin-right: 4px;"
		/>
		<label css="font-family: comfortaa; font-size: 14px;">{
			appsClass?.name ?? "Hyprland"
		}</label>
	</box>
}

export default function client() {
	let clientContainer = <box />
	let clientOverlay: Overlay
	clientOverlay = <overlay
		overlays={[new Widget.Box(), NewClient(hyprland.focusedClient)]}
		css={bind(hyprland, "focusedClient").as(c => {
			let newClient = NewClient(c)
			clientContainer.css = `min-width: ${newClient.get_preferred_width()[0]}px;`
			if (clientOverlay) {
				let os = clientOverlay.overlays
				if (os[os.length-1].children[1].label === newClient.children[1].label) {
					return ""
				}
				clientOverlay.add_overlay(newClient)
				if (os.length > 2) {
					os[os.length-1].css = "margin-top: 50px; opacity: 0;"
				}
				setTimeout(() => {
					if (os.length > 2)
						clientOverlay.remove(os[os.length-1])
				}, 500)
			}
			return ""
		})}
		passThrough={true}>
			{clientContainer}
		</overlay>
	return <button>
		{clientOverlay}
	</button>
}
