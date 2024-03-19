import "./styles.css";

import { Channel } from "./model.js";

const urlParams = new URLSearchParams(window.location.search);
const activeChannelId: number | null = Number(urlParams.get("channel"));

const response = await fetch("http://localhost:4000/api/channels");
const channels = (await response.json())?.result as Channel[];

const renderChanels = (): void => {
  const channelsElement: HTMLElement | null =
    document.querySelector(".channels");
  if (!(channelsElement && channels)) {
    return;
  }
  channels.forEach((channel: Channel): void => {
    const channelEl = document.createElement("a");
    channelEl.classList.add("channel");
    channelEl.href = `?channel=${channel.id}`;
    if (activeChannelId === channel.id) {
      channelEl.classList.add("active");
    }
    const channelH = document.createElement("h3");
    channelH.classList.add("channel-name");
    channelH.innerText = `#${channel.name}`;
    channelEl.appendChild(channelH);
    const channelInfo = document.createElement("p");
    channelInfo.classList.add("channel-meta");
    channelInfo.innerText = `${channel.members} members`;
    channelEl.appendChild(channelInfo);
    channelsElement.appendChild(channelEl);
  });
};

renderChanels();
