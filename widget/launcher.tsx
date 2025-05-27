import { Astal, Gtk, Widget } from "astal/gtk3"
import { EventBox, Scrollable } from "astal/gtk3/widget"
import Apps from "gi://AstalApps"
const { TOP, RIGHT, BOTTOM } = Astal.WindowAnchor
const apps = new Apps.Apps({
	entryMultiplier: 1,
	categories_multiplier: 0,
	description_multiplier: 1,
	executable_multiplier: 1,
	name_multiplier: 2.5,
	keywordsMultiplier: 1,
})

let launcherWindow

function entry(app: Apps.Application) {
	return <overlay
		valign={Gtk.Align.START}>
		<label
			css={`background: green; border: 4px solid yellow; min-height: 100px;`}>
		{app.name}</label>
	</overlay>
}

export default function launcher() {
	if (launcherWindow) {
		launcherWindow.destroy()
		launcherWindow = null
		return false
	}
	launcherWindow = <window 
		anchor={ TOP | RIGHT | BOTTOM }
		className="launcher"
		namespace="launcher"
		widthRequest={800}
		css="background: none;"
		layer={Astal.Layer.OVERLAY}>
			<overlay overlay=
				<eventbox onScroll={() => console.log("scroll")}><box vertical>
					{apps.list.map(app => entry(app))}
				</box></eventbox>>
				<box css="background: linear-gradient(90deg, rgba(0, 0, 0, 0), #000);"/>
			</overlay>
	</window>
	return true
}
