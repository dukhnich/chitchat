import "./styles.css";

import { Channel, ChannelMessage } from "./model.js";

const urlParams = new URLSearchParams(window.location.search);
const activeChannelId: number | null = Number(urlParams.get("channel"));
const activeMessageId: number | null = urlParams.get("message")
  ? Number(urlParams.get("message"))
  : null;

const response = await fetch("http://localhost:4000/api/channels");
const channels = (await response.json())?.result as Channel[];
const response2 = await fetch(
  `http://localhost:4000/api/messages?filter=channelId:eq:${activeChannelId}`
);
const channelMessages = (await response2.json())?.result as ChannelMessage[];

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
  const channelsMsgElement: HTMLElement | null =
    document.querySelector(".messages");
  if (!(channelsMsgElement && channelMessages)) {
    return;
  }
  // <div class="message">
  //   <img class="message-avatar" src="users/adam.png" alt="Adam" />
  //   <div class="message-content">
  //     <div class="message-head">
  //       <div class="message-user">Adam - CEO</div>
  //       <div class="message-time">yesterday 7:36</div>
  //     </div>
  //     <div class="message-text">
  //       Hey team! Just a heads up that we're having a quick stand-up meeting at
  //       10 AM today to sync up on our progress and tackle any blockers. See you
  //       all there! 🚀
  //     </div>
  // <a href="?channel=0&message=1" class="message-thread-link">
  //   3 messages in thread
  // </a>;
  //   </div>
  // </div>;
  channelMessages.forEach((msg: ChannelMessage): void => {
    const channelMsgEl = document.createElement("div");
    channelMsgEl.classList.add("message");
    if (activeMessageId === msg.id) {
      channelMsgEl.classList.add("active");
    }
    const channelMsgAvatar = document.createElement("img");
    channelMsgAvatar.classList.add("message-avatar");
    channelMsgAvatar.src = `http://localhost:4000/assets/users/${
      msg.user.avatarFilename || ""
    }`;
    channelMsgAvatar.alt = msg.user.name || "";
    channelMsgEl.appendChild(channelMsgAvatar);

    const channelMsgContent = document.createElement("div");
    channelMsgContent.classList.add("message-content");

    const channelMsgHead = document.createElement("div");
    channelMsgHead.classList.add("message-head");
    const channelMsgUser = document.createElement("div");
    channelMsgUser.classList.add("message-user");
    channelMsgUser.innerText = `${msg.user.name} - ${msg.user.role}`;
    channelMsgHead.appendChild(channelMsgUser);

    const channelMsgTime = document.createElement("div");
    channelMsgTime.classList.add("message-time");
    channelMsgTime.innerText = msg.time;
    channelMsgHead.appendChild(channelMsgTime);

    channelMsgContent.appendChild(channelMsgHead);

    const channelMsgText = document.createElement("div");
    channelMsgText.classList.add("message-text");
    channelMsgText.innerText = msg.content;
    channelMsgContent.appendChild(channelMsgText);

    if (msg.threadMessages) {
      const channelMsgThread = document.createElement("a");
      channelMsgThread.classList.add("message-thread-link");
      channelMsgThread.innerText = `${msg.threadMessages} messages in thread`;
      channelMsgThread.href = `?channel=${activeChannelId}&message=${msg.id}`;
      channelMsgContent.appendChild(channelMsgThread);
    }

    channelMsgEl.appendChild(channelMsgContent);
    const onClick = (): void => {
      window.location.href = `${window.location.origin}/?channel=${activeChannelId}&message=${msg.id}`;
    };
    channelMsgEl.addEventListener("click", onClick);
    channelsMsgElement.appendChild(channelMsgEl);
  });
};

renderChanels();
