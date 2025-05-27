import { Astal } from "astal/gtk3"
import { popup } from "./popup"
import { execAsync } from "astal"

const { TOP, LEFT } = Astal.WindowAnchor

function PowerWindow() {
	return <window
		className="popupWindow"
		anchor={ TOP | LEFT }
		namespace="lazerpopup">
		<box vertical css="padding: 6px 0;">
			{[
				["Lock", 		"bash -c 'pgrep -x hyprlock || hyprlock &'"	],
				["Suspend", 	"/home/spingus/.config/scripts/lock.sh"		],
				["Logout", 		"hyprctl dispatch exit"						],
				["Shutdown", 	"systemctl poweroff"						],
				["Reboot", 		"systemctl reboot"							],
			].map(action => <button onClicked={() => {
				execAsync(action[1])
					.then(out => print(out))
					.catch(out => print(out))
				popup.window.destroy()
				popup.window = null
				popup.state = ""
			}}>
				<box hexpand css="padding: 4px 8px 4px 0;">
					<icon icon={action[0].toLowerCase()} css="margin: 0 6px;"/>
					<label>{action[0]}</label>
				</box>
			</button>)}
		</box>
	</window>
}

export default function power() {
	return <button onClicked={(self) => {
		if (popup.state !== "power") {
			if (popup.window !== null) {
				popup.window.destroy()
				popup.window = null
			}
			popup.window = PowerWindow();
			popup.state = "power"
			self.toggleClassName("selected", true)
			self.hook(popup.window, "destroy", () => {
				self.toggleClassName("selected", false)
				popup.window = null
				popup.state = ""
			})
		} else {
			popup.window.destroy()
			popup.window = null
			popup.state = ""
		}
	}}>
		<box>
			<icon icon="archlinux" />
		</box>
	</button>
}
