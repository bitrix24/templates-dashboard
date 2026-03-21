<template>
  <svg
    class="setting-icon"
    width="400"
    height="400"
    viewBox="0 0 200 200"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >

    <defs>
      <filter
        id="clay"
        x="-20%"
        y="-20%"
        width="150%"
        height="150%"
      >
        <feDropShadow
          dx="4"
          dy="8"
          stdDeviation="6"
          flood-color="#000"
          flood-opacity="0.15"
        />
      </filter>

      <linearGradient
        id="blue1"
        x1="0%"
        y1="0%"
        x2="100%"
        y2="100%"
      >
        <stop offset="0%" class="b1-s" />
        <stop offset="100%" class="b1-e" />
      </linearGradient>
      <linearGradient
        id="blue2"
        x1="0%"
        y1="0%"
        x2="100%"
        y2="100%"
      >
        <stop offset="0%" class="b2-s" />
        <stop offset="100%" class="b2-e" />
      </linearGradient>
      <linearGradient
        id="green"
        x1="0%"
        y1="0%"
        x2="100%"
        y2="100%"
      >
        <stop offset="0%" class="g-s" />
        <stop offset="100%" class="g-e" />
      </linearGradient>
    </defs>

    <rect
      x="25"
      y="45"
      width="95"
      height="95"
      rx="24"
      fill="url(#blue1)"
      filter="url(#clay)"
    />
    <g transform="translate(23, 39) scale(4.2)" fill="white" class="main-icon">
      <path d="M12.305 5.725a.798.798 0 0 1 .995.767V18.3H5.7V7.734c0-.356.241-.671.593-.764l5.998-1.242zM14.7 18.3h3.6v-7.48a.3.3 0 0 0-.241-.294l-3.36-.672zm0-9.874V6.492c0-1.426-1.34-2.462-2.718-2.13L5.98 5.605l-.014.003A2.19 2.19 0 0 0 4.3 7.734V18.3H4a.7.7 0 0 0 0 1.4h16a.7.7 0 1 0 0-1.4h-.3v-7.48a1.7 1.7 0 0 0-1.367-1.667zm1.8 2.874a.7.7 0 0 1 .7.7v1a.7.7 0 1 1-1.4 0v-1a.7.7 0 0 1 .7-.7M7.3 9.5a.7.7 0 0 1 .7-.7h3a.7.7 0 0 1 0 1.4H8a.7.7 0 0 1-.7-.7m9.9 5.8a.7.7 0 1 0-1.4 0v1a.7.7 0 1 0 1.4 0zm-9.9-2.8a.7.7 0 0 1 .7-.7h3a.7.7 0 1 1 0 1.4H8a.7.7 0 0 1-.7-.7m.7 2.3a.7.7 0 0 0 0 1.4h3a.7.7 0 1 0 0-1.4z" />
    </g>

    <rect
      x="110"
      y="105"
      width="75"
      height="75"
      rx="20"
      fill="url(#blue2)"
      filter="url(#clay)"
    />
    <g transform="translate(114, 109) scale(2.8)" fill="white" class="main-icon">
      <path d="M12.043 12.5c-3.573 0-4.412-5.111-1.883-6.918.42-.3 1.228-.582 1.883-.582 4.66 0 4.29 7.5 0 7.5m-1.07-5.778a2 2 0 0 1 .469-.21c.239-.077.456-.112.6-.112.746 0 1.188.28 1.47.638.313.398.504.998.487 1.677s-.238 1.307-.583 1.736c-.32.398-.756.649-1.373.649-.954 0-1.625-.633-1.864-1.69-.253-1.118.111-2.2.795-2.688" />
      <path d="M6.59 7.167c.28-.204.792-.397 1.247-.436a5.6 5.6 0 0 0-.295 1.504l-.061.028q-.063.031-.068.037c-.368.267-.633.939-.462 1.707.155.697.543 1.004 1.012 1.017.15.575.302 1.14.367 1.379q-.162.021-.335.021c-2.667 0-3.293-3.884-1.405-5.257M5.026 13.511c.69-.433 1.493-.633 2.265-.704l-.004.124a.8.8 0 0 1-.136.465c-.161.222-.395.476-.66.764l-.292.32a3 3 0 0 0-.428.217c-.482.302-.871.778-1.013 1.578h.12c-.225.43-.396.897-.467 1.4h-.036c-.582 0-1.107-.484-1.06-1.127.107-1.456.766-2.443 1.71-3.037M16.295 6.74c3.157.32 2.804 5.684-.301 5.684q-.175 0-.339-.021c.037-.17.128-.47.24-.836v-.002q.078-.254.164-.542a.87.87 0 0 0 .675-.357c.206-.26.354-.667.365-1.126.01-.46-.118-.839-.296-1.069a.8.8 0 0 0-.235-.212 5.6 5.6 0 0 0-.273-1.52M16.708 12.93a2 2 0 0 0-.009-.124c.775.07 1.582.27 2.275.705.945.594 1.604 1.58 1.71 3.037.048.643-.477 1.127-1.059 1.127h-.036a4.3 4.3 0 0 0-.466-1.4h.12c-.143-.8-.532-1.276-1.013-1.578a3 3 0 0 0-.427-.217q-.152-.168-.294-.321a10 10 0 0 1-.66-.764.84.84 0 0 1-.14-.465" />
      <path d="M7.914 13.918C9.14 13.215 10.647 13 12 13s2.86.215 4.087.918c1.268.728 2.19 1.954 2.341 3.824C18.486 18.46 17.9 19 17.25 19H6.75c-.649 0-1.236-.54-1.178-1.258.152-1.87 1.074-3.096 2.342-3.824m9.091 3.682c-.167-1.24-.787-1.993-1.615-2.467-.925-.53-2.15-.733-3.39-.733-1.239 0-2.465.203-3.39.733-.827.474-1.447 1.227-1.615 2.467z" />
    </g>

    <rect
      x="115"
      y="20"
      width="60"
      height="60"
      rx="16"
      fill="url(#green)"
      filter="url(#clay)"
    />
    <g transform="translate(125, 30) scale(1.6)" fill="white" class="main-icon">
      <path d="M10.883 5.063a.3.3 0 0 1 .5.223v3.37a.3.3 0 0 1 .111-.019c6.613.188 8.657 6.477 9.201 8.91.065.287-.286.464-.5.261-1.392-1.326-4.783-4.11-8.693-4.11a.3.3 0 0 1-.118-.024v3.918a.3.3 0 0 1-.501.223l-6.75-6.079a.4.4 0 0 1 0-.594z" />
    </g>
  </svg>
</template>

<style scoped>
.setting-icon {
  --blue1-start: #99C3FF;
  --blue1-stop: #6B9EFF;
  --blue2-start: #B2D4FF;
  --blue2-stop: #8DB6FF;
  --green-start: #A2E68E;
  --green-stop: #76D15B;
  --icon-opacity: 0.95;
  --icon-fill: #fff;
  --shadow-opacity: 0.15;
}
.dark .setting-icon  {
  --blue1-start: #7A9BCC;
  --blue1-stop: #5479C2;
  --blue2-start: #8BA5CC;
  --blue2-stop: #6E8ECA;
  --green-start: #86B875;
  --green-stop: #5D9A4A;
  --icon-opacity: 0.8;
  --icon-fill: #d1d3d3;
  --shadow-opacity: 0.3;
}

.setting-icon .b1-s {
  stop-color: var(--blue1-start);
}

.setting-icon .b1-e {
  stop-color: var(--blue1-stop);
}

.setting-icon .b2-s {
  stop-color: var(--blue2-start);
}

.setting-icon .b2-e {
  stop-color: var(--blue2-stop);
}

.setting-icon .g-s {
  stop-color: var(--green-start);
}

.setting-icon .g-e {
  stop-color: var(--green-stop);
}

.setting-icon .main-icon {
  fill: var(--icon-fill);
  opacity: var(--icon-opacity);
}
</style>
