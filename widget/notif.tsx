import { bind } from "astal"
import { Astal, Gtk, Widget } from "astal/gtk3"
import Notif from "gi://AstalNotifd"
import Pango from "gi://Pango?version=1.0"
const notifs = Notif.get_default()

const { TOP, RIGHT } = Astal.WindowAnchor
const notifPlaceholder = "/home/protoshark/.config/ags/assets/notif.svg"
let notifWindow: Widget.Window

function NewNotif(notif: Notif.Notification) {
	return <box
		className="notifBox"
		halign={Gtk.Align.END}
		valign={Gtk.Align.START} >
		<box
		spacing={8}>
		<box 
			halign={Gtk.Align.CENTER}
			valign={Gtk.Align.CENTER}
			className="notifIcon" 
			css={`background-image: url("${notif.image ?? notifPlaceholder}")`} 
		/>
		<box vertical={true} valign={Gtk.Align.CENTER} spacing={6}>
			<label 
				halign={Gtk.Align.START} 
				css="font-size: 16px;" 
				wrap={true} 
				maxWidthChars={20} 
				wrapMode={Pango.WrapMode.WORD_CHAR}>
				{notif.summary.substring(0, 80)}
			</label>
			<label 
				halign={Gtk.Align.START} 
				css="font-size: 14px;" 
				wrap={true} 
				maxWidthChars={22} 
				wrapMode={Pango.WrapMode.WORD_CHAR}>
				{notif.body.substring(0, 88)}
			</label>
		</box>
	</box></box>
}

function notify(notif: Notif.Notification) {
	let thisNotif = NewNotif(notif)
	if (notifWindow) {
		let os = notifWindow.get_child().overlays
		let top = 12
		for (let i = os.length-1; i > 0; i--) {
			top += thisNotif.get_preferred_height()[0] - 40
			if (os[i].get_preferred_width()[0] >= 352) {
				os[i].css = `margin-top: ${top}px;`
			}
		}
		notifWindow.get_child().add_overlay(thisNotif)
		notifWindow.get_child().get_child().heightRequest = os[1].get_preferred_height()[0] + thisNotif.get_preferred_height()[0]
	} else {
		notifWindow = <window
			anchor={ TOP | RIGHT }
			marginTop={36}
			css="background: transparent;"
			namespace="notification">
			<overlay overlay={thisNotif}>
				<box 
					halign={Gtk.Align.END}
					valign={Gtk.Align.START}
					widthRequest={thisNotif.get_preferred_width()[0]} 
					heightRequest={1200}
				/>
			</overlay>
		</window>
	}
	setTimeout(() => {
		let os = notifWindow.get_child().overlays
		thisNotif.css = `margin-right: -352px; margin-top: ${thisNotif.get_preferred_height()[0]-thisNotif.get_child().get_preferred_height()[0]-52}px; transition: cubic-bezier(0.64, 0, 0.78, 0) 0.3s;`
		setTimeout(() => {
			let os = notifWindow.get_child().overlays
			notifWindow.get_child().remove(thisNotif)
			if (os.length < 3) {
				notifWindow.destroy()
				notifWindow = null
			}
		}, 400)
	}, 3000)
}

function notifCount() {
	return <label css="padding-top: 2px;">
		{bind(notifs, "notifications").as(ns => ns.length)}
	</label>
}

export default function notifWidget() {
	return <button
		onClicked={() => {}}
		setup={(self) => self.hook(notifs, "notified", (_, id) => {
			notify(notifs.get_notification(id))
		})}>
		<box>
			<icon icon="notif" css="color: white;" />
			{notifCount()}
		</box>
	</button>
}
