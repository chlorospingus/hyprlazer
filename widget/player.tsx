import { bind } from "astal"
import { Astal, Gtk, Widget } from "astal/gtk3"
import { Box, Button, Overlay } from "astal/gtk3/widget"
import { popup } from "./popup"
import Mpris from "gi://AstalMpris"

const mpris = Mpris.get_default()
const { TOP, RIGHT } = Astal.WindowAnchor

let playerWindow

function NewCover(coverPath: string) {
	let b = <box
		className="coverArt" 
		halign={Gtk.Align.CENTER}
		valign={Gtk.Align.CENTER}
		css={`
			background-image: url("${coverPath}");
			background-size: contain;
			background-color: transparent;
		`}
	>
	</box>
	return b
}

function cover(player: Mpris.Player) {
	let coverContainer = <box />
	let coverOverlay: Overlay
	coverOverlay = <overlay
		passThrough={true}
		overlay={NewCover(player.coverArt)}
		css={bind(player, "coverArt").as(coverPath => {
			let newCover = NewCover(coverPath)
			coverContainer.widthRequest = newCover.get_preferred_width()[0]
			if (coverOverlay) {
				coverOverlay.overlay = NewCover(player.coverArt)
			}
			return ""
		})}
	>
		<box widthRequest={24} heightRequest={24}/>
	</overlay>
	return coverOverlay
}

function wrap(str: string) {
	if (str.length > 40) {
		str = str.substring(0, 40)
	}
	if (str.length > 20) {
		return str.substring(0, 20) + "\n" + str.substring(20)
	}
	return str
}

function playerBox(player: Mpris.Player) {
	return <box
		vertical={true}
		spacing={4}
		>
		<box
			className="playerButton"
			halign={Gtk.Align.CENTER}>
			<button onClicked={() => {player.previous()}}>
				<box>
				<icon icon="lazer-previous-symbolic" css="font-size: 24px" />
				</box>
			</button>
			<button onClicked={() => {player.play_pause()}}>
				<box>
				<icon icon={bind(player, "playbackStatus").as(p => 
					(p === Mpris.PlaybackStatus.PLAYING) 
						? "lazer-pause-symbolic" 
						: "lazer-play-symbolic"
				)} css="font-size: 24px;" />
			</box>
			</button>
			<button onClicked={() => {player.next()}}>
				<box>
				<icon icon="lazer-next-symbolic" css="font-size: 24px;" />
				</box>
			</button>
		</box>
		<overlay overlay={
			new Widget.Box({
				vertical: true,
				halign: Gtk.Align.CENTER,
				valign: Gtk.Align.CENTER,
				className: "playerLabel",
				children: [
					new Widget.Label({
						className: "playerTitle",
						justify: Gtk.Justification.CENTER,
						label: bind(player, "title").as(str => wrap(str))
					}),
					new Widget.Label({
						className: "playerArtist",
						justify: Gtk.Justification.CENTER,
						label: bind(player, "artist").as(str => wrap(str))
					})
				]
			})
		}>
			<overlay overlay={
				new Widget.Box({
					halign: Gtk.Align.CENTER,
					valign: Gtk.Align.CENTER,
					className: "bigCoverShadow",
				})
			}>
				<box 
					className="bigCoverArt"
					css={bind(player, "coverArt").as(c => {
						return `background-image: url("${c}");`
					})}>
				</box>
			</overlay>
		</overlay>
	</box>
}

function PlayerWindow() {
	return <window
		className="popupWindow"
		anchor = {TOP | RIGHT}
		namespace="lazerpopup"
		marginRight={160}>
		<box 
			vertical={true}
			spacing={12}
			css="margin-left: 40px; margin-right: 40px; padding-top: 4px"
		>
			{mpris.players.map(p => playerBox(p))}
		</box>
	</window>
}

export default function player() {
	let fillerBox = <box/>
	let playerContainer = <label widthRequest={24} />
	let playerButton: Button
	playerButton = <button
		visible={bind(mpris, "players").as(players => (players.length > 0))}
		css="padding: 0 8px;"
		onClicked={(self) => {
			if (popup.state !== "player") {
				if (popup.window) {
					popup.window.destroy()
					popup.window = null
				}
				popup.window = PlayerWindow();
				popup.state = "player"
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
	>
		<box spacing={6}>
			<icon icon="player-symbolic"
		  	css="font-size: 24px;"/>
			<overlay passThrough={true} overlay={bind(mpris, "players").as((ps) => {
				return (ps.length > 0) ? cover(ps[0]) : fillerBox
			})}>
				{playerContainer}
			</overlay>
		</box>
	</button>
	return playerButton
}
